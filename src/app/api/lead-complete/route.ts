import { NextRequest, NextResponse } from "next/server";
import { doLeadComplete } from "@/lib/lead-complete";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    whatsapp?: string;
    city?: string;
    segment?: string;
    objective?: string;
    conversationSummary?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const segment = typeof body.segment === "string" ? body.segment.trim() : undefined;
  const objective = typeof body.objective === "string" ? body.objective.trim() : undefined;
  const conversationSummary = typeof body.conversationSummary === "string" ? body.conversationSummary.trim() : "";

  if (!name || !whatsapp || !city) {
    return NextResponse.json(
      { error: "name, whatsapp e city são obrigatórios." },
      { status: 400 }
    );
  }

  await doLeadComplete({
    name,
    whatsapp,
    city,
    segment,
    objective,
    conversationSummary,
  });

  return NextResponse.json({ ok: true });
}
