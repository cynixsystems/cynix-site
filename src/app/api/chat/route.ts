import { NextRequest, NextResponse } from "next/server";
import { generateText, createGateway, Output } from "ai";
import { canCalculatePrice } from "@/lib/chat/validation";
import {
  createInitialConversationState,
  updateConversationState,
} from "@/lib/chat/conversation-state";
import type { LeadState, ConversationState } from "@/lib/chat/types";

const RATE_LIMIT_REQUESTS = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora

const rateLimitStore = new Map<
  string,
  { count: number; windowStart: number }
>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_REQUESTS;
}

const CHAT_SYSTEM_PROMPT = `Você é o assistente comercial da CYNIX. A Cynix desenvolve: (1) Sites profissionais e (2) Aplicativos e sistemas sob medida para pequenos e médios negócios (mini mercados, restaurantes, padarias, postos, controle financeiro, etc.).

FLUXO OBRIGATÓRIO:
1. PRIMEIRA PERGUNTA: Se o estado ainda não tiver "objetivo" definido, SEMPRE comece perguntando: "Você precisa de um site profissional para sua empresa ou de um aplicativo/sistema sob medida (PDV, gestão, controle financeiro, etc.)?" Extraia do texto do usuário: se ele disser site, landing, página web → objetivo "site" ou "landing"; se disser app, sistema, aplicativo, PDV, gestão, software → objetivo "sistema".
2. APÓS A ESCOLHA: Direcione o fluxo.
   - Se objetivo for site/landing: pergunte sobre número de páginas, se já tem identidade visual, nome/contato. Atualize numeroPaginas (number), identidadeVisual (boolean), nome, email, whatsapp.
   - Se objetivo for sistema: pergunte o segmento (mini mercado, restaurante, padaria, posto, controle financeiro, etc.), o principal problema que quer resolver, nome e contato. Atualize segmento, problemaPrincipal, nome, email, whatsapp.
3. ORÇAMENTO: Quando o usuário perguntar quanto custa, valor ou orçamento, OU quando já tiver dados suficientes (objetivo + contato), sugira uma FAIXA ESTIMADA em reais (ex.: "Para um site institucional com até 5 páginas, a faixa costuma ficar entre R$ X e R$ Y" ou "Para um sistema sob medida no seu segmento, a faixa varia entre R$ X e R$ Y. Posso formalizar uma proposta detalhada."). Use faixas genéricas plausíveis (ex. sites: 2.500 a 8.000; sistemas: 5.000 a 20.000 conforme complexidade). Em seguida diga que ele pode fechar pelo botão de checkout para receber proposta formal.
4. FECHAMENTO: Quando sugerir orçamento ou o usuário demonstrar interesse em contratar, conduza para o checkout (botão será exibido automaticamente).

REGRAS:
- Faça UMA pergunta por vez. Nunca peça nome, e-mail e problema na mesma mensagem.
- Nunca invente dados: use só segmento, problema ou contato que o usuário realmente disse. Se não disse o segmento, pergunte qual é; não assuma (ex.: semijoias).
- Nunca mencione que é IA.
- Sempre responda APENAS em JSON válido: { "reply": "sua mensagem", "updates": { ... } }.
- Em "updates" inclua SOMENTE os campos do LeadState que conseguir extrair.
- Mensagens curtas e objetivas. Tom profissional e amigável.`;

export interface ChatRequestBody {
  message: string;
  state?: Partial<LeadState>;
  conversationState?: Partial<ConversationState>;
}

export interface ChatResponseBody {
  message: string;
  reply?: string;
  updates: Partial<LeadState>;
  canCalculate: boolean;
  showCheckoutButton: boolean;
  checkoutUrl?: string;
  conversationState: ConversationState;
}

function parseAiResponse(content: string): { reply: string; updates: Partial<LeadState> } {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```") ? trimmed.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "") : trimmed;
  const parsed = JSON.parse(jsonStr) as unknown;
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Resposta da IA não é um objeto JSON.");
  }
  const obj = parsed as Record<string, unknown>;
  const reply = obj.reply;
  const updates = obj.updates;
  if (typeof reply !== "string") {
    throw new Error("Campo 'reply' ausente ou inválido na resposta da IA.");
  }
  if (updates !== undefined && (typeof updates !== "object" || updates === null || Array.isArray(updates))) {
    throw new Error("Campo 'updates' deve ser um objeto.");
  }
  return { reply, updates: (updates as Partial<LeadState>) ?? {} };
}

export async function POST(request: NextRequest) {
  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido. Envie { message, state? }." },
      { status: 400 }
    );
  }

  if (typeof body.message !== "string") {
    return NextResponse.json(
      { error: "Campo 'message' é obrigatório e deve ser string." },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Limite de requisições excedido. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  const apiKey = process.env.VERCEL_AI_GATEWAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "VERCEL_AI_GATEWAY_API_KEY não configurada." },
      { status: 500 }
    );
  }

  const state: LeadState = { ...body.state };
  const gateway = createGateway({ apiKey });
  const model = gateway("openai/gpt-4o-mini");

  let reply: string;
  let updates: Partial<LeadState>;

  try {
    const result = await generateText({
      model,
      system: CHAT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify({ message: body.message, state }),
        },
      ],
      maxOutputTokens: 300,
      temperature: 0.4,
      output: Output.json(),
    });

    const raw = result.output as Record<string, unknown> | undefined;
    if (raw && typeof raw.reply === "string") {
      reply = raw.reply;
      const u = raw.updates;
      updates =
        u !== undefined && typeof u === "object" && u !== null && !Array.isArray(u)
          ? (u as Partial<LeadState>)
          : {};
    } else {
      const parsed = parseAiResponse(result.text);
      reply = parsed.reply;
      updates = parsed.updates;
    }
  } catch (err) {
    console.error("AI Gateway error:", err);
    return NextResponse.json(
      { error: "Falha ao comunicar com o serviço de atendimento." },
      { status: 502 }
    );
  }

  const mergedState: LeadState = { ...state, ...updates };
  const canCalculate = canCalculatePrice(mergedState);

  const previousConversationState: ConversationState = {
    ...createInitialConversationState(),
    ...body.conversationState,
  };
  const conversationState = updateConversationState(
    body.message,
    mergedState,
    previousConversationState
  );

  const response: ChatResponseBody = {
    message: reply,
    reply,
    updates,
    canCalculate,
    showCheckoutButton: conversationState.readyToClose,
    ...(conversationState.readyToClose && { checkoutUrl: "/checkout" }),
    conversationState,
  };

  return NextResponse.json(response);
}
