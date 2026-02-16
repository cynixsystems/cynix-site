import { ChatWidget } from "./components/ChatWidget";
import { OpenChatLink } from "./components/OpenChatLink";
import { SiteHeader } from "./components/SiteHeader";

const WHATSAPP_URL =
  "https://wa.me/5551995580969?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Cynix";

function ChevronRight({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Globe({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

function Layers({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function Zap({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function TrendingUp({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function Cpu({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="16" x="4" y="4" rx="2" ry="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2M15 20v2M9 2v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
    </svg>
  );
}

const SEGMENTOS = [
  { nome: "Mini mercados", desc: "PDV, controle de estoque e vendas integrado." },
  { nome: "Restaurantes", desc: "Cardápio digital, pedidos e gestão de mesa." },
  { nome: "Padarias", desc: "Ponto de venda e controle de produção." },
  { nome: "Postos de gasolina", desc: "Gestão de bombas, frentes e conveniência." },
  { nome: "Controle financeiro empresarial", desc: "Fluxo de caixa, relatórios e dashboards." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-100">
      <SiteHeader />

      <main>
        {/* Hero — crescimento empresarial */}
        <section className="mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl rounded-2xl bg-black/50 px-6 py-8 backdrop-blur-sm md:px-8 md:py-10">
            <h1 className="text-contrast-strong text-neon-strong mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Seu negócio cresce quando sua presença digital é profissional
            </h1>
            <p className="text-contrast text-neon mb-10 text-lg leading-relaxed text-zinc-200 md:text-xl">
              Desenvolvemos sites de alto impacto e aplicativos sob medida para pequenas e médias empresas. Tecnologia que vende mais e opera melhor.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#solucoes"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Ver soluções
                <ChevronRight />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
              >
                Falar com consultor
              </a>
            </div>
          </div>
        </section>

        {/* Nossas Soluções — dois blocos */}
        <section id="solucoes" className="border-t border-zinc-800/80 bg-zinc-950/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-contrast text-neon mb-3 text-2xl font-semibold text-white md:text-3xl">
              Nossas soluções
            </h2>
            <p className="text-contrast mb-14 max-w-xl text-zinc-300">
              Do site que converte visitantes em clientes ao sistema que organiza sua operação.
            </p>

            {/* Bloco 1: Sites */}
            <div className="mb-20">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <Globe size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Desenvolvimento de sites profissionais</h3>
                  <p className="text-sm text-zinc-400">Presença digital que gera autoridade e vendas</p>
                </div>
              </div>
              <p className="mb-8 max-w-2xl text-zinc-400">
                Sites institucionais e de conversão: design moderno, responsivo e otimizado para buscar e para o usuário. Sua marca com credibilidade e clareza para o cliente decidir por você.
              </p>
              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Sites institucionais e landing pages
                </li>
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Design responsivo e profissional
                </li>
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Foco em conversão e resultados
                </li>
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Manutenção e suporte
                </li>
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Pedir orçamento de site
                <ChevronRight size={14} />
              </a>
            </div>

            {/* Bloco 2: Aplicativos / Sistemas */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
                  <Layers size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Aplicativos e sistemas sob medida</h3>
                  <p className="text-sm text-zinc-400">Soluções que automatizam e escalam seu negócio</p>
                </div>
              </div>
              <p className="mb-6 max-w-2xl text-zinc-400">
                Desenvolvemos sistemas e aplicativos exclusivos para o seu segmento: PDV, gestão, controle financeiro e operação. Tecnologia alinhada à sua realidade para você vender mais e gastar menos tempo com planilhas e trabalho manual.
              </p>

              <p className="mb-4 text-sm font-medium text-zinc-300">Atendemos segmentos como:</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SEGMENTOS.map((s) => (
                  <div
                    key={s.nome}
                    className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
                  >
                    <h4 className="mb-1 font-medium text-white">{s.nome}</h4>
                    <p className="text-xs text-zinc-400">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Pedir orçamento de sistema ou app
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section id="diferenciais" className="border-t border-zinc-800/80 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-contrast text-neon mb-3 text-2xl font-semibold text-white md:text-3xl">
              Por que a Cynix
            </h2>
            <p className="text-contrast mb-14 max-w-xl text-zinc-300">
              Posicionamos sua empresa com tecnologia estratégica e suporte contínuo.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                  <Cpu size={22} />
                </div>
                <h3 className="mb-2 font-semibold text-white">Tecnologia sob medida</h3>
                <p className="text-sm text-zinc-400">
                  Soluções desenhadas para o seu negócio, não pacotes genéricos. Cada projeto é único.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-400">
                  <TrendingUp size={22} />
                </div>
                <h3 className="mb-2 font-semibold text-white">Foco em lucro</h3>
                <p className="text-sm text-zinc-400">
                  Tudo que desenvolvemos tem um objetivo: aumentar vendas, reduzir custos ou ganhar tempo.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-600/10 text-amber-400">
                  <Zap size={22} />
                </div>
                <h3 className="mb-2 font-semibold text-white">Automação</h3>
                <p className="text-sm text-zinc-400">
                  Menos trabalho manual e menos erro. Processos que rodam sozinhos e escalam com você.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-violet-600/10 text-violet-400">
                  <Layers size={22} />
                </div>
                <h3 className="mb-2 font-semibold text-white">Escalabilidade</h3>
                <p className="text-sm text-zinc-400">
                  Sistemas e sites preparados para crescer com sua empresa, sem precisar refazer do zero.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metodologia */}
        <section id="metodologia" className="border-t border-zinc-800/80 bg-zinc-950/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-contrast text-neon mb-3 text-2xl font-semibold text-white md:text-3xl">
              Como trabalhamos
            </h2>
            <p className="text-contrast mb-14 max-w-xl text-zinc-300">
              Processo claro, do primeiro contato à entrega e suporte.
            </p>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="mb-3 block text-2xl font-bold text-blue-500">1.</span>
                <h3 className="mb-2 font-semibold text-white">Diagnóstico</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Entendemos seu negócio, objetivos e dores para propor a solução certa.
                </p>
              </div>
              <div>
                <span className="mb-3 block text-2xl font-bold text-blue-500">2.</span>
                <h3 className="mb-2 font-semibold text-white">Proposta</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Escopo, cronograma e investimento transparentes. Início após sua aprovação.
                </p>
              </div>
              <div>
                <span className="mb-3 block text-2xl font-bold text-blue-500">3.</span>
                <h3 className="mb-2 font-semibold text-white">Desenvolvimento</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Desenvolvemos com acompanhamento próximo e comunicação constante.
                </p>
              </div>
              <div>
                <span className="mb-3 block text-2xl font-bold text-blue-500">4.</span>
                <h3 className="mb-2 font-semibold text-white">Entrega e suporte</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Colocamos no ar e oferecemos suporte pós-entrega conforme combinado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section id="contato" className="border-t border-zinc-800/80 py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-contrast text-neon text-2xl font-semibold text-white md:text-3xl">
              Pronto para levar seu negócio ao próximo nível?
            </h2>
            <p className="text-contrast mx-auto mt-3 max-w-md text-zinc-300">
              Fale com nossa equipe pelo WhatsApp ou use o chat. Resposta rápida e orçamento sem compromisso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                WhatsApp
              </a>
              <OpenChatLink />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-2 text-lg font-semibold text-white">Cynix</p>
              <p className="text-sm text-zinc-500">
                Sites profissionais e aplicativos sob medida para pequenas e médias empresas.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Navegação</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#solucoes" className="hover:text-white">Soluções</a></li>
                <li><a href="#diferenciais" className="hover:text-white">Diferenciais</a></li>
                <li><a href="#metodologia" className="hover:text-white">Como trabalhamos</a></li>
                <li><a href="#contato" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Contato</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white">
                Solicitar orçamento (WhatsApp)
              </a>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Soluções</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Sites profissionais</li>
                <li>Aplicativos e sistemas</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-800/80 pt-8 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Cynix. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
