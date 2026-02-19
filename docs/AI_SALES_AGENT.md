# AI Sales Agent — integração e variáveis

## Arquivos criados

| Arquivo | Descrição |
|--------|-----------|
| `src/app/components/AiSalesAgent.tsx` | Componente: botão flutuante + modal full-screen, histórico, typing indicator |
| `src/app/api/ai-sales-agent/route.ts` | API: recebe mensagem + sessionId + history, chama OpenAI, retorna `{ reply }` |
| `src/app/api/leads/route.ts` | API: POST salva lead (name, whatsapp, city, businessType, objective, timestamp); GET lista (in-memory) |

## Variáveis de ambiente

No `.env.local` (e na Vercel → Settings → Environment Variables):

```env
OPENAI_API_KEY=sk-...
```

Obrigatório para o assistente comercial. Sem essa chave, a rota `/api/ai-sales-agent` retorna 500.

## Integração

- **Páginas:** `src/app/page.tsx` e `src/app/[locale]/page.tsx` usam `<AiSalesAgent />` no lugar de `<ChatWidget />`.
- **Abrir chat por código:** o botão do assistente tem `data-chat-toggle`. Para abrir programaticamente: `document.querySelector('[data-chat-toggle]')?.click()` (ex.: `OpenChatLink` já usa isso).

## Fluxo da conversa (API)

1. Saudação  
2. Tipo de negócio (mercado, restaurante, pizzaria, empresa, outro)  
3. Diagnóstico (site atual, PDV, WhatsApp, objetivo)  
4. Qualificação (interna)  
5. Proposta (sites, apps, PDV, automações)  
6. Captura de lead (nome, whatsapp, cidade)  
7. Fechamento  

## Memória e leads

- **Conversa:** in-memory por `sessionId` no servidor; o cliente envia `history` a cada mensagem.
- **Leads:** armazenados em memória em `src/app/api/leads/route.ts`. Para produção, trocar por banco (ex.: Supabase) ou planilha/CRM.
