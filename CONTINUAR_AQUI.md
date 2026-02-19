# Continuar daqui

**Finalizado hoje.** Pode continuar amanhã a partir daqui.

**Última parada:** Assistente comercial (AI Sales Agent), alerta de lead em tempo real (POST `/api/lead-alert` + Z-API). Teste de disparo ok (API 200); Z-API retorna 404 "Instance not found" — conferir instância ativa no painel Z-API para o WhatsApp receber de fato.

---

## O que já está feito (até aqui)

- Site Cynix com landing (Sites + Aplicativos/sistemas), chat, fundo com `cynix-bg.png`.
- **Autenticação:** login e cadastro (Supabase); redirecionamento após login com `?redirect=` (ex.: voltar para /checkout ou /minha-area).
- **Header da home:** componente `SiteHeader` – quando **não logado**: Entrar, Cadastrar, Solicitar orçamento; quando **logado**: Minha área, Sair, Solicitar orçamento.
- **Área do cliente:** `/minha-area` (lista de projetos; por enquanto vazia) e `/minha-area/projeto/[id]` (status + prévias). Ambas protegidas: quem não está logado é enviado para `/login?redirect=...`.
- **Checkout:** página `/checkout` criada e protegida (só acessa logado); placeholder com link para WhatsApp; integração de pagamento fica para depois.
- **Proteção de rotas:** componente `RequireAuth` usado em `/minha-area`, `/minha-area/projeto/[id]` e `/checkout`.
- **Documento:** `docs/SUGESTOES_NIVEL_INTERNACIONAL.md` com sugestões de performance, SEO, confiança, UX, acessibilidade, Supabase e prioridades.
- Git e atalhos: **CYNIX - Iniciar Projeto**, **CYNIX - Checkpoint**, **FINALIZAR_CYNIX.bat**.
- **Conta Vercel:** Pro (Plus) — deploy e Observability disponíveis.

---

## Como retomar

1. Abrir o **Cursor** em `c:\cynix-site`.
2. Abrir **CONTINUAR_AQUI.md** ou **RELATORIO_PROJETO.md** e dizer: *"Continuamos de onde paramos"* ou *"Rodar o CONTINUAR_AQUI"*.
3. Para rodar o site: duplo clique em **CYNIX - Iniciar Projeto**. Se der porta em uso: **FINALIZAR_CYNIX.bat** e depois iniciar de novo.

---

## i18n (PT-BR, EN, ES)

- **Idiomas:** português (padrão), inglês e espanhol. O cliente escolhe pela **bandeira** no header (🇧🇷 PT, 🇺🇸 EN, 🇪🇸 ES).
- **URLs:** `/pt-BR`, `/en`, `/es` (e todas as rotas com prefixo: `/en/login`, `/es/minha-area`, etc.). Acesso a `/` redireciona para `/pt-BR`.
- **Arquivos:** `messages/pt-BR.json`, `messages/en.json`, `messages/es.json`; `src/i18n/routing.ts`, `request.ts`, `navigation.ts`; `src/middleware.ts`; páginas em `src/app/[locale]/`.

## Próximos passos (quando quiser)

- ~~Menu mobile (hamburger) no header.~~ ✅ Feito: botão hamburger em mobile, painel com links, LanguageSelector, auth e WhatsApp.
- ~~Supabase: tabelas `projects` e `previews`, RLS; popular `/minha-area` com dados reais.~~ ✅ Feito: schema em `docs/supabase-schema-projects-preview.sql`, lib `src/lib/supabase/projects.ts`, `/minha-area` e `/minha-area/projeto/[id]` buscam do Supabase. Execute o SQL no Supabase Dashboard para criar as tabelas.
- Checkout: integração de pagamento e resumo do pedido.
- Itens do documento internacional: Open Graph, sitemap, otimizar imagem de fundo, política de privacidade.
- Traduzir textos de login/cadastro/minha-area/checkout (por enquanto em PT-BR).

*Atualize este arquivo quando mudar algo importante ou quando parar em outro ponto.*

---

## Alerta comercial em tempo real (Z-API)

- **Variáveis no `.env.local`:** `ZAPI_INSTANCE_ID`, `ZAPI_TOKEN`, `CYNIX_ALERT_WHATSAPP=5591998381331`.
- **POST `/api/lead-alert`:** recebe `{ nome, telefone, interesse?, resumoConversa? }`, envia mensagem para o WhatsApp da CYNIX via Z-API. Lead é só notificação; salvamento de lead segue em `doLeadComplete` / `/api/lead-complete`.
- **Chat:** ao capturar lead (nome + telefone + cidade), o backend chama `sendLeadAlert` em background (sem travar o chat).
- **Teste de disparo:** `POST http://localhost:3000/api/lead-alert` com body `{"nome":"Teste Lead","telefone":"51999999999","interesse":"ecommerce","resumoConversa":"cliente quer loja online"}`. Resposta esperada: `200` e `{"ok":true}`. No terminal do Next: `[lead-alert] sucesso envio WhatsApp` ou `[lead-alert] erro envio WhatsApp` (ex.: 404 Instance not found se a instância Z-API não existir ou estiver inativa).
