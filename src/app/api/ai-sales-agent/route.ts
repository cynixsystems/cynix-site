import { NextRequest, NextResponse } from "next/server";
import { generateText, createGateway } from "ai";
import OpenAI from "openai";
import { doLeadComplete } from "@/lib/lead-complete";
import { sendLeadAlert } from "@/lib/lead-alert";

const SALES_AGENT_SYSTEM = `You are a senior digital sales consultant from CYNIX. Your job is to diagnose business needs and guide prospects to the best digital solution. You must ask questions, qualify leads and guide toward a proposal. Never respond generically.

CYNIX offers: professional sites, e-commerce, PDV systems, apps for markets/restaurants/pizzerias, automations, digital presence.

Follow this conversation flow. Advance one step at a time based on what you already know from the conversation.

STEP 1 — Greeting (only at start)
"Olá! Sou o assistente comercial da CYNIX. Posso entender seu negócio e sugerir a melhor solução digital?"

STEP 2 — Business type
Ask which applies: mercado, restaurante, pizzaria, empresa, outro (or similar). One question.

STEP 3 — Diagnosis
Ask: already has a site? uses system/PDV? uses WhatsApp for sales? main goal (sell more, automate, delivery, online presence). One or two questions at a time.

STEP 4 — Qualification
Classify the lead based on answers. Do not announce this; use it internally to tailor the next step.

STEP 5 — Proposal
Suggest CYNIX services that fit: site, apps, automations, digital PDV, integrations. Be specific to their segment and answers.

STEP 6 — Lead capture
Collect: nome, whatsapp, cidade. One at a time if needed.

STEP 7 — Closing
"Perfeito. Um especialista da CYNIX pode montar a melhor solução para você." Suggest next step (e.g. contact by WhatsApp or specialist will reach out).

LEAD_CAPTURE (mandatory when you have name, whatsapp and city):
When you have collected name, whatsapp and city from the user, end your reply with exactly ONE line (no other text after it), in this exact format:
LEAD_CAPTURE:{"name":"Nome completo","whatsapp":"5511999999999","city":"Cidade","segment":"tipo de negócio ou vazio","objective":"objetivo ou vazio"}
Use the exact keys: name, whatsapp, city, segment, objective. Segment = business type (mercado, restaurante, etc). Objective = what they want (site, app, etc). No line breaks inside the JSON. The user must not see this line; it is stripped by the system. Your visible reply must end right before this line.

Rules:
- Reply only in Portuguese (Brazil).
- One main question or short block per message; avoid long paragraphs.
- Never invent data the user did not say.
- If user already gave business type, do not ask again. If already gave name/whatsapp/city, do not ask again.
- Be professional and warm, like a skilled SDR.`;

type StoredMessage = { role: "user" | "assistant"; content: string };

const sessionStore = new Map<string, StoredMessage[]>();

function getOrCreateSession(sessionId: string): StoredMessage[] {
  let session = sessionStore.get(sessionId);
  if (!session) {
    session = [];
    sessionStore.set(sessionId, session);
  }
  return session;
}

export async function POST(request: NextRequest) {
  let body: { message?: string; sessionId?: string; history?: StoredMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";

  if (!message) {
    return NextResponse.json({ error: "Campo 'message' é obrigatório." }, { status: 400 });
  }

  const vercelApiKey = process.env.VERCEL_AI_GATEWAY_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!vercelApiKey && !openaiApiKey) {
    return NextResponse.json(
      {
        error:
          "Configure VERCEL_AI_GATEWAY_API_KEY (Vercel) ou OPENAI_API_KEY no .env.local ou na Vercel.",
      },
      { status: 500 }
    );
  }

  const history: StoredMessage[] = Array.isArray(body.history)
    ? body.history
    : sessionId
      ? getOrCreateSession(sessionId)
      : [];

  const chatMessages = [
    { role: "system" as const, content: SALES_AGENT_SYSTEM },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  let reply: string;

  try {
    if (vercelApiKey) {
      const gateway = createGateway({ apiKey: vercelApiKey });
      const model = gateway("openai/gpt-4o-mini");
      const result = await generateText({
        model,
        system: SALES_AGENT_SYSTEM,
        messages: chatMessages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        maxOutputTokens: 400,
        temperature: 0.7,
      });
      reply = result.text?.trim() || "Desculpe, não consegui processar. Pode repetir?";
    } else if (openaiApiKey) {
      const openai = new OpenAI({ apiKey: openaiApiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
        max_tokens: 400,
        temperature: 0.7,
      });
      reply =
        completion.choices[0]?.message?.content?.trim() ||
        "Desculpe, não consegui processar. Pode repetir?";
    } else {
      reply = "Desculpe, não consegui processar. Pode repetir?";
    }

    const leadCapturePrefix = "LEAD_CAPTURE:";
    const idx = reply.indexOf(leadCapturePrefix);
    let cleanReply = reply;
    let leadCaptureComplete = false;
    if (idx !== -1) {
      const before = reply.slice(0, idx).trim();
      const rest = reply.slice(idx + leadCapturePrefix.length).trim();
      try {
        const leadJson = JSON.parse(rest) as Record<string, unknown>;
        const name = typeof leadJson.name === "string" ? leadJson.name.trim() : "";
        const whatsapp = typeof leadJson.whatsapp === "string" ? leadJson.whatsapp.trim() : "";
        const city = typeof leadJson.city === "string" ? leadJson.city.trim() : "";
        if (name && whatsapp && city) {
          cleanReply = before;
          leadCaptureComplete = true;
          const conversationSummary = [...history.map((m) => `${m.role}: ${m.content}`), `user: ${message}`, `assistant: ${cleanReply}`].join("\n");
          const segment = typeof leadJson.segment === "string" ? leadJson.segment.trim() : "";
          const objective = typeof leadJson.objective === "string" ? leadJson.objective.trim() : "";
          await doLeadComplete({
            name,
            whatsapp,
            city,
            segment: segment || undefined,
            objective: objective || undefined,
            conversationSummary,
          });
          sendLeadAlert({
            nome: name,
            telefone: whatsapp,
            interesse: objective || segment || "—",
            resumoConversa: conversationSummary,
          }).catch(() => {});
        } else {
          cleanReply = before || reply;
        }
      } catch (_) {
        cleanReply = before || reply;
      }
    }

    if (sessionId) {
      const session = getOrCreateSession(sessionId);
      session.push({ role: "user", content: message });
      session.push({ role: "assistant", content: cleanReply });
    }

    return NextResponse.json(leadCaptureComplete ? { reply: cleanReply, state: { stage: "lead_capture_complete" } } : { reply: cleanReply });
  } catch (err) {
    console.error("AI Sales Agent error:", err);
    return NextResponse.json(
      { error: "Falha ao comunicar com o assistente. Tente novamente." },
      { status: 502 }
    );
  }
}
