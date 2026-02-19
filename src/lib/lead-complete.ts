import { saveLead } from "@/lib/leads-store";

export interface LeadCompletePayload {
  name: string;
  whatsapp: string;
  city: string;
  segment?: string;
  objective?: string;
  conversationSummary: string;
}

export async function doLeadComplete(payload: LeadCompletePayload): Promise<void> {
  saveLead({
    name: payload.name,
    whatsapp: payload.whatsapp,
    city: payload.city,
    businessType: payload.segment,
    objective: payload.objective,
  });

  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const adminPhone = process.env.CYNIX_ALERT_WHATSAPP;

  if (!instanceId || !token || !adminPhone) {
    return;
  }

  const phone = adminPhone.startsWith("55") ? adminPhone : `55${adminPhone.replace(/\D/g, "")}`;
  const message = `🚨 NOVO LEAD CYNIX

Nome: ${payload.name}
WhatsApp cliente: ${payload.whatsapp}
Cidade: ${payload.city}
Segmento: ${payload.segment ?? "—"}
Objetivo: ${payload.objective ?? "—"}

Resumo: ${payload.conversationSummary}`;

  try {
    const res = await fetch(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("Z-API lead-complete error:", res.status, text);
    }
  } catch (e) {
    console.error("Z-API lead-complete fetch error:", e);
  }
}
