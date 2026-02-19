const DEFAULT_ALERT_PHONE = "5591998381331";

export interface LeadAlertPayload {
  nome: string;
  telefone: string;
  interesse: string;
  resumoConversa: string;
}

export async function sendLeadAlert(payload: LeadAlertPayload): Promise<void> {
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const phone = process.env.CYNIX_ALERT_WHATSAPP ?? DEFAULT_ALERT_PHONE;

  if (!instanceId || !token) {
    console.warn("[lead-alert] ZAPI_INSTANCE_ID ou ZAPI_TOKEN não configurados. Alerta não enviado.");
    return;
  }

  const message = `🚨 NOVO LEAD CYNIX

Nome: ${payload.nome}
Telefone: ${payload.telefone}
Interesse: ${payload.interesse}

Resumo:
${payload.resumoConversa}`;

  try {
    const res = await fetch(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.startsWith("55") ? phone : `55${phone.replace(/\D/g, "")}`,
          message,
        }),
      }
    );
    if (res.ok) {
      console.log("[lead-alert] sucesso envio WhatsApp → CYNIX:", payload.nome, payload.telefone);
    } else {
      const text = await res.text();
      console.error("[lead-alert] erro envio WhatsApp:", res.status, text);
    }
  } catch (e) {
    console.error("[lead-alert] erro envio WhatsApp:", e);
  }
}
