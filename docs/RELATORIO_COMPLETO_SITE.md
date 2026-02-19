# Relatório completo – Site CYNIX

## O que já está pronto

### Estrutura e stack
- Next.js 13 (App Router), TypeScript, Tailwind CSS
- Projeto rodando localmente e configurado para deploy na Vercel
- Build de produção validado (`npm run build`)

### Páginas e rotas
- **Landing raiz (`/`):** página institucional Cynix (hero, serviços, contato, WhatsApp, AiSalesAgent)
- **Landing com idioma (`/pt-BR`, `/en`, `/es`):** mesma ideia com header completo (SiteHeader), i18n
- **Login e cadastro:** `/login`, `/cadastro` (Supabase)
- **Minha área:** `/minha-area` (lista de projetos do Supabase) e `/minha-area/projeto/[id]` (detalhe + prévias)
- **Checkout:** `/checkout` (protegido, placeholder para pagamento)
- **APIs:** `/api/chat`, `/api/ai-sales-agent`, `/api/lead-alert`, `/api/lead-complete`, `/api/leads`

### Header e navegação
- Header com logo, links (Serviços, Contato etc.), Entrar/Cadastrar ou Minha área/Sair, Solicitar orçamento
- **Seletor de idioma:** botões redondos com bandeiras (Brasil, EUA, Espanha) em `/pt-BR`, `/en`, `/es` – componente `LanguageSwitcher`
- Menu mobile (hamburger) com painel completo

### i18n
- Português (pt-BR), inglês (en), espanhol (es)
- Mensagens em `messages/pt-BR.json`, `en.json`, `es.json`
- Rotas com prefixo de locale

### Comercial e leads
- **Assistente comercial (AI Sales Agent):** chat em fluxo estruturado, captura de lead
- **Alerta de lead:** POST `/api/lead-alert` e `/api/lead-complete`; integração Z-API para WhatsApp (configurar instância no painel Z-API)
- Salvamento de lead em memória; opção de persistir em Supabase/CRM depois

### Autenticação e dados
- Login/cadastro com Supabase
- Proteção de rotas (RequireAuth) em minha-area e checkout
- Schema Supabase para `projects` e `previews` (SQL em `docs/supabase-schema-projects-preview.sql`) – executar no Dashboard para popular `/minha-area`

### Deploy
- `vercel.json` com framework Next.js
- Branch principal: `main`
- Raiz do build: raiz do repositório (Root Directory em branco na Vercel)
- Domínio: configurar cynix.com.br em Vercel → Domains e DNS no registrador

---

## O que falta para terminar

1. **Configuração na Vercel (produção)**  
   - Variável `VERCEL_AI_GATEWAY_API_KEY` para o chat/assistente responder em produção  
   - Domínio cynix.com.br em Settings → Domains e DNS apontando corretamente  

2. **Z-API**  
   - Instância ativa no painel Z-API (hoje retorna 404 “Instance not found”) para os alertas de lead no WhatsApp  

3. **Checkout**  
   - Integração de pagamento (ex.: Mercado Pago) e resumo do pedido (além do link WhatsApp atual)  

4. **Supabase em produção**  
   - Executar o SQL de `projects` e `previews` no projeto Supabase de produção  
   - Garantir que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão nas variáveis de ambiente da Vercel  

5. **SEO e documento internacional**  
   - Open Graph (meta tags para redes sociais)  
   - Sitemap e robots.txt  
   - Otimizar imagem de fundo (peso/performance)  
   - Página de política de privacidade (se aplicável)  

6. **Traduções**  
   - Revisar e completar textos de login, cadastro, minha-area e checkout nos 3 idiomas (hoje em grande parte em PT-BR)  

7. **Bandeiras no header da raiz**  
   - ~~Botões redondos com bandeiras no header da página raiz (`/`)~~ ✅ Feito: `RootLanguageSwitcher` na landing raiz com bandeiras Brasil, EUA, Espanha.

---

## Lista resumida do que falta

| Item | Descrição |
|------|------------|
| 1 | Configurar `VERCEL_AI_GATEWAY_API_KEY` na Vercel |
| 2 | Configurar domínio cynix.com.br (Vercel + DNS) |
| 3 | Ativar instância Z-API para alertas WhatsApp |
| 4 | Checkout: pagamento e resumo do pedido |
| 5 | Rodar SQL Supabase (projects/previews) e configurar envs na Vercel |
| 6 | SEO: Open Graph, sitemap, robots.txt |
| 7 | Otimizar imagem de fundo e política de privacidade (se necessário) |
| 8 | Traduções completas (login, cadastro, minha-area, checkout) |
