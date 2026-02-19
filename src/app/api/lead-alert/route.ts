import { NextRequest, NextResponse } from "next/server";
import { sendLeadAlert } from "@/lib/lead-alert";

export async function POST(request: NextRequest) {
  let body: { nome?: string; telefone?: string; interesse?: string; resumoConversa?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  const telefone = typeof body.telefone === "string" ? body.telefone.trim() : "";
  const interesse = typeof body.interesse === "string" ? body.interesse.trim() : "";
  const resumoConversa = typeof body.resumoConversa === "string" ? body.resumoConversa.trim() : "";

  if (!nome || !telefone) {
    return NextResponse.json(
      { error: "nome e telefone são obrigatórios." },
      { status: 400 }
    );
  }

  await sendLeadAlert({
    nome,
    telefone,
    interesse: interesse || "—",
    resumoConversa: resumoConversa || "—",
  });

  return NextResponse.json({ ok: true });
}
