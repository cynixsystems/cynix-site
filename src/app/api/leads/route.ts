import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLead } from "@/lib/leads-store";

export interface LeadPayload {
  name?: string;
  whatsapp?: string;
  city?: string;
  businessType?: string;
  objective?: string;
}

export async function POST(request: NextRequest) {
  let body: LeadPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const businessType = typeof body.businessType === "string" ? body.businessType.trim() : "";
  const objective = typeof body.objective === "string" ? body.objective.trim() : "";

  const lead = saveLead({
    name,
    whatsapp,
    city,
    businessType,
    objective,
  });

  return NextResponse.json({ ok: true, id: lead.timestamp });
}

export async function GET() {
  const leads = getLeads();
  return NextResponse.json({ leads, count: leads.length });
}
