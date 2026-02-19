# Git e Vercel — por que o deploy não sobe

Este guia reestrutura a ligação entre o repositório e a Vercel e lista o que conferir quando o deploy **não sobe** ou o site **não abre**.

---

## 1. Resumo: o que precisa estar certo

| Onde | O quê |
|------|--------|
| **Git** | Repo `canalvideosadrenalina-max/cynix-site`, branch **main**, push funcionando. |
| **Vercel** | Projeto **importado** desse repo, **Root Directory** em branco, branch **main** como Production. |
| **Build** | Comando `npm run build` (padrão); sem erros nos **Build Logs**. |
| **URL** | Usar a URL que a Vercel mostra (ex.: `https://cynix-site-xxx.vercel.app/`) ou o domínio configurado (ex.: cynix.com.br). |

Se Git e Vercel não estiverem “juntos”, o deploy não sobe: ou porque o push não chega ao repo certo, ou porque a Vercel não está conectada a esse repo/branch, ou porque o build falha.

**Se você tem mais de um projeto na Vercel com o mesmo nome e as alterações não aparecem no site:** veja a **seção 7** (identificar o projeto certo e reconectar o repo).

---

## 2. Conferir Git (no seu PC)

No terminal, na pasta do projeto:

```bash
cd c:\cynix-site
git remote -v
git branch
git status
```

- **remote:** deve ser `https://github.com/canalvideosadrenalina-max/cynix-site.git` (ou o mesmo repo em SSH).
- **branch:** deve ser **main** (e ser essa que você usa para produção).
- **status:** depois de um push, “Your branch is up to date with 'origin/main'”.

Se o push der **403**, o Windows pode estar usando outra conta (ex.: mercado-atual). Corrija pelas credenciais do Windows ou usando um **Personal Access Token** da conta **canalvideosadrenalina-max** (ver `GIT_PUSH_E_VERCEL.md`).

Depois de qualquer alteração:

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

Confira no GitHub se o commit apareceu: **https://github.com/canalvideosadrenalina-max/cynix-site** (branch **main**).

---

## 3. Reestruturar a Vercel (conectar ao repo certo)

Para o deploy “subir”, a Vercel precisa estar **ligada** a esse repositório e à branch **main**.

### 3.1 Projeto já existe na Vercel

1. Acesse **https://vercel.com** e abra o projeto do site (ex.: **cynix-site**).
2. **Settings** → **Git**:
   - **Repository:** deve ser **canalvideosadrenalina-max/cynix-site** (ou o mesmo que você usa no `git remote`).
   - **Production Branch:** **main**.
3. **Settings** → **General**:
   - **Root Directory:** deixe **em branco** (raiz do repo = raiz do projeto).
   - **Framework Preset:** **Next.js**.
   - **Build Command:** `npm run build` (ou vazio para usar o padrão).
   - **Output Directory:** vazio (padrão Next.js).

Se **Root Directory** estiver preenchido (ex.: `cynix-site` ou outra pasta), a Vercel pode não achar o `package.json` e o build falhar. **Limpe** e salve.

### 3.2 Ainda não tem projeto na Vercel

1. **Add New…** → **Project**.
2. Em **Import Git Repository**, escolha **canalvideosadrenalina-max/cynix-site** (se não aparecer, **Configure GitHub** e autorize a Vercel).
3. **Import**.
4. Na configuração:
   - **Root Directory:** em branco.
   - **Framework Preset:** Next.js.
   - **Build Command:** `npm run build`.
5. Em **Environment Variables** (opcional para a landing abrir):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `VERCEL_AI_GATEWAY_API_KEY`
   - (opcional) `NEXT_PUBLIC_BASE_URL` = `https://cynix.com.br`
6. **Deploy**.

A partir daí, cada **push em main** deve disparar um novo deploy automático.

---

## 4. Por que o deploy “não sobe” — checklist

Use esta lista quando o deploy não aparecer ou o site não abrir.

### 4.1 Deploy não dispara (nada acontece na Vercel após o push)

- [ ] **Git:** o push foi feito para **origin main**? (`git push origin main`)
- [ ] **GitHub:** o commit está visível em **github.com/canalvideosadrenalina-max/cynix-site** (branch **main**)?
- [ ] **Vercel → Git:** em **Settings** → **Git**, o repositório é **canalvideosadrenalina-max/cynix-site** e a **Production Branch** é **main**?
- [ ] **Vercel → Deployments:** às vezes o deploy demora; atualize a página e veja se surge um novo deployment com o último commit.

Se o repo ou a branch na Vercel estiverem diferentes do que você usa no Git, a Vercel não vai construir o seu código. Ajuste **Settings** → **Git** e, se precisar, **Redeploy** manual.

### 4.2 Deploy aparece mas fica **Failed** (vermelho)

- [ ] Abra o deploy que falhou → **Building** ou **Logs**.
- [ ] Copie a **mensagem de erro** (ex.: erro de compilação, módulo não encontrado, variável de ambiente obrigatória no build).
- [ ] **Root Directory:** em **Settings** → **General** deve estar **vazio**.
- [ ] **Node:** o projeto tem `"engines": { "node": ">=18.0.0" }` no `package.json`; a Vercel usa Node 18+ por padrão. Se o erro for de Node, em **Settings** → **General** você pode definir **Node.js Version** (ex.: 18.x).

Corrija o erro indicado nos logs (código ou configuração), faça commit e push de novo, ou **Redeploy** após corrigir as settings.

### 4.3 Deploy **Ready** (verde) mas o site não abre

- [ ] Use a URL que a Vercel mostra no topo do projeto (ex.: `https://cynix-site-xxxx.vercel.app`).
- [ ] Teste **com barra final:** `https://cynix-site-xxxx.vercel.app/`
- [ ] Teste em aba anônima ou outro navegador (cache/extensões).
- [ ] Se estiver usando **cynix.com.br:** em **Settings** → **Domains** o domínio deve estar **Valid**; no registrador, o DNS deve estar igual ao que a Vercel pede.

Se a URL da Vercel abrir e o domínio próprio não, o problema é DNS/domínio, não Git nem build.

---

## 5. Arquivos do projeto que afetam o deploy

- **Raiz do repo** = raiz do projeto (onde está `package.json`, `next.config.js`, `vercel.json`). Não use **Root Directory** na Vercel a menos que o código Next.js esteja dentro de uma subpasta.
- **vercel.json** (na raiz): define `framework`, `buildCommand`, `installCommand`. Não é obrigatório; a Vercel detecta Next.js sozinha. Está aqui para deixar explícito e evitar ambiguidade.
- **package.json** → `"build": "next build"` e `"engines": { "node": ">=18.0.0" }`: garantem comando de build e Node compatível na Vercel.
- **next.config.js**: usa `next-intl` com `./src/i18n/request.ts`; não exige configuração extra na Vercel.

Nada no código atual exige variáveis de ambiente **no build** para a landing da raiz (`/`) funcionar. Variáveis são necessárias para **chat** e **login** em produção.

---

## 6. Passo a passo rápido (depois de tudo certo)

1. Editar código em `c:\cynix-site`.
2. `git add .` → `git commit -m "mensagem"` → `git push origin main`.
3. Ver no GitHub se o commit está em **main**.
4. Abrir o projeto na Vercel → **Deployments**: deve aparecer um novo deploy e, em alguns minutos, ficar **Ready**.
5. Abrir a URL do projeto (ou cynix.com.br) e testar.

Se algo falhar, use a seção 4 (checklist) e os **Build Logs** do deploy que falhou para ver o motivo exato.

---

## 7. Mais de um projeto com o mesmo nome na Vercel (deploy vai para o site errado)

Se você tem **vários projetos** na Vercel com nome parecido (ex.: dois “cynix-site”) e as alterações **não aparecem** no site que você abre, o deploy provavelmente está indo para **outro** projeto. O repositório no GitHub só pode estar conectado a **um** projeto na Vercel por vez; quem recebe o push é o projeto que está ligado ao repo.

### 7.1 Descobrir qual projeto está recebendo o deploy

1. Acesse **https://vercel.com** e entre no seu time/conta.
2. Na lista de projetos, abra **cada** projeto que tiver nome parecido (ex.: cynix-site).
3. Em cada um, vá em **Settings** → **Git** e veja o **Repository**:
   - O projeto em que aparecer **canalvideosadrenalina-max/cynix-site** (ou o repo que você usa) é o que **recebe** o deploy quando você dá push na **main**.
4. Anote a **URL** de cada projeto (ex.: `https://cynix-site-abc123.vercel.app` e `https://cynix-site-xyz789.vercel.app`).
5. Abra cada URL no navegador e veja em qual delas as **suas alterações mais recentes** aparecem (ex.: botões redondos com bandeiras). A que tiver as alterações é a que está ligada ao repo certo.

Assim você descobre: **qual projeto = qual URL** e qual deles está conectado ao Git.

### 7.2 Fazer o site “certo” ser o que recebe o deploy

Você tem duas situações:

**A) O projeto que você abre (ou o domínio cynix.com.br) é o errado**  
Ou seja, o deploy está indo para o projeto **certo** na Vercel, mas você está abrindo a URL de **outro** projeto (o antigo/duplicado).

- **Solução:** passe a abrir a **URL do projeto que está ligado ao repo** (a que você anotou em 7.1). Se quiser usar cynix.com.br, em **Settings** → **Domains** do projeto **certo**, adicione cynix.com.br e remova o domínio do projeto **errado**.

**B) O projeto ligado ao repo é o errado**  
Ou seja, quando você dá push, quem faz deploy é um projeto que você não usa (o antigo), e o site que você abre é outro projeto que nunca recebe deploy.

- **Solução:**  
  1. No projeto **errado** (o que está recebendo o deploy hoje): **Settings** → **Git** → **Disconnect** (desconectar o repositório).  
  2. No projeto **certo** (o que você quer que seja o site oficial): **Settings** → **Git** → **Connect Git Repository** e escolha **canalvideosadrenalina-max/cynix-site**, branch **main**.  
  3. Dê um **Redeploy** no projeto certo ou faça um push de teste. A partir daí, o deploy passa a ir para esse projeto.

### 7.3 Evitar confusão no futuro

- **Renomear na Vercel:** em **Settings** → **General** → **Project Name**, dê um nome único ao projeto que é o site oficial (ex.: **cynix-site-oficial** ou **cynix-com-br**). O antigo pode ficar como **cynix-site-antigo** ou ser removido se não for mais usado.
- **Um repo = um projeto:** o ideal é ter **só um** projeto na Vercel conectado a **canalvideosadrenalina-max/cynix-site**. Se houver outro projeto com o mesmo repo, desconecte (7.2 B) ou delete o projeto duplicado.

### 7.4 Resumo rápido

| Situação | O que fazer |
|----------|-------------|
| Você abre uma URL e as alterações não aparecem | A URL que você abre é de outro projeto; use a URL do projeto que está em **Settings** → **Git** ligado ao repo **cynix-site**. |
| Dois projetos ligados ao mesmo repo | Não é possível; só um pode estar ligado. Desconecte o que estiver errado e conecte o projeto certo. |
| Quero que cynix.com.br mostre o site novo | Em **Domains** do projeto **certo**, adicione cynix.com.br; no projeto antigo, remova o domínio. |
