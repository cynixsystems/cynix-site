# Colocar o site Cynix na web com Git e Vercel

Siga estes passos para publicar o site na internet.

---

## 1. GitHub (ou outro Git)

### Se ainda não tem um repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login.
2. Clique em **+** → **New repository**.
3. Nome sugerido: `cynix-site` (ou o que preferir).
4. Deixe **Private** ou **Public**; **não** marque "Add a README" (o projeto já tem arquivos).
5. Clique em **Create repository**.

### Conectar o projeto ao repositório

No terminal, na pasta do projeto (`c:\cynix-site`):

```bash
# Só se ainda não tiver configurado o remote (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/cynix-site.git
```

Se já tiver um `origin` e quiser trocar:

```bash
git remote set-url origin https://github.com/SEU_USUARIO/cynix-site.git
```

### Enviar o código (primeira vez)

```bash
git add .
git status
git commit -m "Site Cynix: landing, chat, login, área do cliente, checkout"
git branch -M main
git push -u origin main
```

Se o repositório já tiver sido criado com README e você tiver um histórico local em `master`:

```bash
git push -u origin master:main
```

Depois disso, o código estará no GitHub.

---

## 2. Vercel (hospedagem)

1. Acesse [vercel.com](https://vercel.com) e entre com sua conta (pode usar **Continue with GitHub**).
2. Clique em **Add New…** → **Project**.
3. **Import** o repositório `cynix-site` (ou o nome que você deu). Se não aparecer, clique em **Configure GitHub** e autorize a Vercel a ver seus repositórios.
4. Na tela de importação:
   - **Framework Preset:** Next.js (já detectado).
   - **Root Directory:** deixe em branco.
   - **Build Command:** `npm run build` (padrão).
   - **Output Directory:** padrão.
5. **Environment Variables:** clique em **Environment Variables** e adicione as mesmas variáveis que você usa no `.env.local`:

   | Nome | Valor | Observação |
   |------|--------|------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Do painel Supabase → Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Chave anon public do Supabase |
   | `VERCEL_AI_GATEWAY_API_KEY` | sua chave | Para o chat (se usar Vercel AI) |

   Marque **Production**, **Preview** e **Development** se quiser que valha para todos os ambientes.

6. Clique em **Deploy**. A Vercel vai fazer o build e publicar.
7. Quando terminar, você recebe uma URL tipo `cynix-site-xxx.vercel.app`. Pode configurar um domínio próprio depois em **Project → Settings → Domains**.

---

## 3. Atualizações (depois do primeiro deploy)

Sempre que quiser atualizar o site na web:

```bash
git add .
git commit -m "Descrição do que mudou"
git push
```

A Vercel detecta o push no branch conectado (geralmente `main`) e faz um novo deploy automático.

---

## 4. Resumo rápido

| Onde | O quê |
|------|--------|
| **GitHub** | Código versionado; Vercel lê daqui |
| **Vercel** | Build, hospedagem e URL pública |
| **Supabase** | Login/cadastro e banco (variáveis no .env e na Vercel) |
| **.env.local** | Só no seu PC; nunca commitar. Na Vercel use Environment Variables |

Se algo falhar no deploy, confira o **Build Logs** no painel da Vercel (aba do deploy) e as variáveis de ambiente.
