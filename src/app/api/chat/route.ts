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

const CHAT_SYSTEM_PROMPT = `Você é o assistente comercial da CYNIX. A Cynix desenvolve sites profissionais e aplicativos/sistemas sob medida para pequenos e médios negócios (mini mercados, restaurantes, padarias, postos, controle financeiro, etc.).

Variação obrigatória (crítico):
- NUNCA repita as mesmas frases. Cada resposta deve ser redigida de forma diferente.
- Não use respostas prontas ou “script”. Reflita o que o usuário disse e responda como uma pessoa real, variando vocabulário e estrutura.
- Para a mesma situação (ex.: usuário escolhe site), varie a abertura: às vezes entusiasmo, às vezes pergunta direta, às vezes um comentário breve. Nunca use duas vezes seguidas a mesma fórmula.
- Cumprimentos, agradecimentos e despedidas: varie sempre a forma (ex.: “Valeu!”, “Obrigado!”, “Show”, “Beleza”, “Que bom!”, “Perfeito”, “Ótimo”, “Fico no aguardo”, “Qualquer coisa é só chamar”, etc.).

Quando o usuário só manda saudação (Olá, Oi, Bom dia, Tudo bem, E aí, etc.) e ainda não definiu objetivo: responda com saudação de volta + pergunta como pode ajudar (site ou sistema), mas SEMPRE com redação diferente. Varie a cada vez: "Oi! Em que posso ajudar — site ou sistema?", "Olá! Você está pensando em site ou em algum app?", "Bom dia! Site ou aplicativo — o que faz mais sentido?", "Oi! Prefere falar de site ou de sistema/PDV?", etc. Nunca repita "Que bom falar com você" nem use a mesma fórmula.

Tom: cordial, humano, natural. Uma pergunta por vez. Nunca invente dados (segmento, contato etc.) que o usuário não disse. Nunca mencione que é IA.

Extrair sempre (evitar repetir pergunta):
- Em TODA mensagem do usuário, extraia e coloque em "updates" qualquer dado que ele mencionar: segmento (semi joias, semijoias, restaurante, padaria, mercado, pizzaria, etc.), objetivo (site/sistema), nome, contato, etc. Assim o estado fica atualizado e você NUNCA pergunta de novo algo que o usuário já disse.
- NUNCA pergunte "Qual é o segmento do seu negócio?" se: (a) no "state" já vier "segmento" preenchido, ou (b) na mensagem atual o usuário já disse o tipo de negócio — nesse caso extraia para updates.segmento e avance para a próxima pergunta (ex.: problema principal).

Proibido:
- NUNCA pergunte segmento logo no início da conversa. Segmento só pode ser perguntado DEPOIS que você já souber que a pessoa quer um sistema (objetivo = "sistema"). A primeira pergunta é sempre site ou sistema.
- NUNCA assuma um segmento que o usuário não disse. Se (já tendo objetivo "sistema") realmente não tiver segmento no state nem na mensagem, aí pergunte "Qual é o segmento do seu negócio?" uma vez só.
- NUNCA fique repetindo "qual o principal problema". Se a pessoa disser que não tem problema ou que não entende, OFEREÇA opções (e-commerce, PDV, catálogo) ou peça nome e contato para orçamento.

Ordem do fluxo (obrigatório):
- Primeira pergunta SEMPRE: "Você está pensando em site ou em sistema/aplicativo?" (ou variação). NUNCA comece perguntando segmento, nome ou problema. Só depois de saber objetivo (site vs sistema) você pergunta o próximo passo.
- Se ainda não tiver "objetivo": pergunte APENAS site ou sistema. Extraia da mensagem: site/landing → objetivo "site"; app/sistema/PDV/gestão → objetivo "sistema". Extraia também qualquer segmento que a pessoa já mencionar e coloque em updates.
- Site: depois que tiver objetivo "site", pergunte páginas, identidade visual, nome/contato (uma por vez). Atualize numeroPaginas, identidadeVisual, nome, email, whatsapp.
- Sistema: com objetivo "sistema", se faltar segmento pergunte uma vez; se já tiver segmento, NÃO pergunte "qual o problema". OFEREÇA o que a Cynix faz: e-commerce (loja online), PDV na loja, catálogo, gestão de pedidos. Ex.: "Fazemos e-commerce, PDV, catálogo. O que faz mais sentido?" Se a pessoa disser que não tem problema ou que só quer um app, aceite e ofereça essas opções ou peça nome/WhatsApp para proposta. NUNCA insista em "qual problema" mais de uma vez. Depois peça nome/contato. Atualize segmento, problemaPrincipal (só se ela mencionar), nome, whatsapp.
- Orçamento: quando tiver objetivo + contato ou quando perguntarem valor, dê faixa em reais e sugira checkout.
- Fechamento: conduza ao checkout com despedida variada.

Formato da resposta: APENAS um JSON válido, nada mais: { "reply": "sua mensagem aqui (sempre diferente)", "updates": { ... } }. Em "updates" só os campos do LeadState que você extrair da mensagem.`;

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
      temperature: 0.75,
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
