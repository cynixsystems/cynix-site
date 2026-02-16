# Site não abre na Vercel — o que foi feito e o que conferir

## Ajustes feitos no código

1. **Middleware:** A rota **`/`** não é mais redirecionada pelo next-intl. Quem acessa a raiz do site recebe direto a landing em `src/app/page.tsx` (header, hero, serviços, tech, rodapé, chat). As rotas `/pt-BR`, `/en`, `/es` continuam com o middleware de i18n.

2. **Landing na raiz:** `src/app/page.tsx` é uma página completa, sem depender de locale nem de redirecionamento.

## O que conferir na Vercel

1. **Deploy**
   - Vercel → projeto **cynix-site** → aba **Deployments**.
   - O último deploy está **Ready** (verde) ou **Failed** (vermelho)?
   - Se **Failed:** abra o deploy → **Building** ou **Logs** e veja a mensagem de erro.

2. **Build**
   - Em **Settings** → **General**: **Framework Preset** = Next.js.
   - **Build Command:** `npm run build` (ou vazio para usar o padrão).
   - **Output Directory:** vazio (padrão).

3. **Variáveis de ambiente**
   - **Settings** → **Environment Variables**.
   - Não são obrigatórias para a landing abrir, mas para o **chat** e **login** funcionarem você precisa de:
     - `VERCEL_AI_GATEWAY_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **URL**
   - Use a URL que a Vercel mostra no topo do projeto (ex.: `https://cynix-site-xxxx.vercel.app`).
   - Teste **exatamente:** `https://seu-projeto.vercel.app/` (com a barra no final também).

5. **Domínio próprio**
   - Se estiver usando **cynix.com.br**, confira em **Settings** → **Domains** se está **Valid** e se o DNS no registrador está igual ao que a Vercel pede.

## Se ainda não abrir

- Abra o site e pressione **F12** → aba **Console**. Anote qualquer erro em vermelho.
- Teste em aba anônima (para descartar cache/extensões).
- Tente outro navegador ou rede (ex.: celular com 4G).
