import { saveLead } from "@/lib/leads-store";

export interface CapturedLead {
  name: string;
  whatsapp: string;
  city: string;
  segment?: string;
  objective?: string;
}

export async function onLeadCaptured(
  lead: CapturedLead,
  conversationSummary: string
): Promise<void> {
  saveLead({
    name: lead.name,
    whatsapp: lead.whatsapp,
    city: lead.city,
    businessType: lead.segment,
    objective: lead.objective,
  });

  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const romualdoPhone = process.env.ROMUALDO_WHATSAPP_NUMBER;
  const resendKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  const whatsappPromise =
    instanceId && token && romualdoPhone
      ? fetch(
          `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: romualdoPhone.startsWith("55") ? romualdoPhone : `55${romualdoPhone.replace(/\D/g, "")}`,
              message: `🚨 NOVO LEAD CYNIX

Nome: ${lead.name}
Segmento: ${lead.segment ?? "—"}
Objetivo: ${lead.objective ?? "—"}
Cidade: ${lead.city}
WhatsApp cliente: ${lead.whatsapp}

Entre em contato agora.`,
            }),
          }
        ).catch((e) => {
          console.error("Z-API WhatsApp error:", e);
        })
      : Promise.resolve();

  const emailPromise =
    resendKey && notificationEmail
      ? fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL ?? "leads@cynix.com.br",
            to: [notificationEmail],
            subject: "NOVO LEAD CYNIX",
            html: `
<p>Lead captado agora.</p>
<p><strong>Nome:</strong> ${lead.name}</p>
<p><strong>WhatsApp:</strong> ${lead.whatsapp}</p>
<p><strong>Segmento:</strong> ${lead.segment ?? "—"}</p>
<p><strong>Objetivo:</strong> ${lead.objective ?? "—"}</p>
<p><strong>Cidade:</strong> ${lead.city}</p>
<p><strong>Resumo da conversa:</strong></p>
<pre style="white-space:pre-wrap;font-size:12px;">${conversationSummary}</pre>
`,
          }),
        }).catch((e) => {
          console.error("Resend email error:", e);
        })
      : Promise.resolve();

  await Promise.allSettled([whatsappPromise, emailPromise]);
}
