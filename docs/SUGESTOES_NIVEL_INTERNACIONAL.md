# Sugestões para um site nível internacional (Cynix)

Este documento reúne práticas e ideias para levar o site da Cynix a um padrão de excelência global: performance, confiança, SEO, acessibilidade e experiência do usuário.

---

## 1. Performance e Core Web Vitals

- **LCP (Largest Contentful Paint):** manter &lt; 2,5s. Otimizar a imagem de fundo (`cynix-bg.png`): usar WebP/AVIF, tamanho adequado (ex.: 1920px de largura) e `loading="lazy"` onde fizer sentido.
- **FID / INP:** evitar JavaScript pesado no carregamento inicial. O chat e o header já são client-side; manter bundles enxutos (code-splitting).
- **CLS (Cumulative Layout Shift):** reservar altura ou aspect-ratio para imagens e blocos que carregam depois; evitar que botões/links “pulem” quando o estado de login é resolvido no header.
- **Next.js:** usar `next/image` para todas as imagens quando possível; habilitar compressão e formatos modernos.
- **Fontes:** as fontes locais (Geist) já são boas; evitar fontes externas bloqueantes.

---

## 2. SEO (Search Engine Optimization)

- **Meta e títulos:** já existe `metadata` no `layout.tsx`; garantir título e descrição únicos por página (ex.: `/minha-area`, `/login` com `noindex` se não quiser indexar).
- **Open Graph e Twitter Card:** adicionar `openGraph` e `twitter` em `metadata` para bons previews ao compartilhar no WhatsApp, redes sociais e mensageiros.
- **URLs semânticas:** manter URLs claras (`/minha-area`, `/minha-area/projeto/[id]`, `/checkout`).
- **Sitemap e robots.txt:** gerar `sitemap.xml` e configurar `robots.txt` (Next.js permite via `app/sitemap.ts` e `app/robots.ts`).
- **Schema.org:** considerar `Organization` e `LocalBusiness` (ou `ProfessionalService`) em JSON-LD na home para rich results.

---

## 3. Confiança e credibilidade

- **Reconhecimento:** seção “Quem já confia” ou “Cases” (mesmo que iniciais) com logos ou depoimentos.
- **Contato claro:** WhatsApp e e-mail visíveis; endereço ou região de atuação, se fizer sentido.
- **Segurança:** HTTPS obrigatório; política de privacidade e termos de uso (páginas ou links), e menção ao LGPD quando houver dados pessoais.
- **Consistência visual:** manter identidade (cores, logo, tom) em todas as páginas, incluindo login, cadastro, minha área e checkout.

---

## 4. Experiência do usuário (UX)

- **Navegação:** menu principal já existe; em mobile, implementar menu hamburger para não esconder “Entrar”, “Cadastrar” e “Solicitar orçamento”.
- **Feedback:** mensagens claras em formulários (login, cadastro, chat); loading states nos botões e no RequireAuth.
- **Fluxo de conversão:** CTA principal (“Solicitar orçamento”) sempre acessível; após login, redirecionar para a página que o usuário queria (já implementado com `?redirect=`).
- **Área do cliente:** lista de projetos e status compreensíveis; prévias com links óbvios (“Abrir preview”).

---

## 5. Acessibilidade (A11y)

- **Contraste:** texto sobre fundo escuro e sobre a imagem de fundo já usa classes de contraste; validar com ferramentas (ex.: WCAG AA).
- **Foco:** garantir que links e botões tenham `:focus-visible` bem visível (outline ou ring).
- **Semântica:** usar `<header>`, `<main>`, `<nav>`, `<section>`, `<button>` vs `<a>` corretamente (já em uso).
- **Labels:** todos os inputs com `<label>` associado; aria-labels onde faltar texto visível (ex.: ícones).
- **Idioma:** `lang="pt-BR"` no `<html>` já está definido.

---

## 6. Internacionalização (i18n) – opcional

- Se no futuro quiser público em outros idiomas: estruturar textos em chaves (JSON ou módulos) e usar rotas ou prefixos (`/en`, `/es`) ou domínios por idioma. Next.js tem suporte a i18n.

---

## 7. Dados e backend (Supabase)

- **Tabelas:** criar `projects` (user_id, name, status, created_at) e `previews` (project_id, title, url, created_at); ativar RLS e políticas por `user_id`.
- **Auth:** no painel Supabase, configurar e-mail de confirmação, recuperação de senha e, se quiser, login social (Google, etc.).
- **Área do cliente:** quando existir backend, buscar projetos reais do usuário em `/minha-area` e detalhes em `/minha-area/projeto/[id]`.

---

## 8. Monitoramento e análise

- **Erros:** considerar Sentry (ou similar) para erros de front e API.
- **Analytics:** Google Analytics 4 ou alternativa, com respeito à privacidade (cookie banner se necessário para LGPD/GDPR).
- **Uptime:** se hospedar na Vercel, usar health check ou monitor externo para avisar se o site cair.

---

## Resumo de prioridades sugeridas

| Prioridade | Item |
|-----------|------|
| Alta      | Menu mobile (hamburger), Open Graph/Twitter, sitemap/robots, otimizar imagem de fundo |
| Média     | Schema.org, política de privacidade, casos/depoimentos, tabelas Supabase + dados reais na área do cliente |
| Quando possível | i18n, Sentry, cookie banner, testes E2E |

Atualize este documento conforme for implementando cada ponto. Isso ajuda a manter o foco em um site realmente de nível internacional.
