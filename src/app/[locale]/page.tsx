import { setRequestLocale } from "next-intl/server";
import { AiSalesAgent } from "../components/AiSalesAgent";
import { SiteHeader } from "../components/SiteHeader";

const WHATSAPP_URL =
  "https://wa.me/5551995580969?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Cynix";

const SERVICOS = [
  "Apps para mercados",
  "Sistemas para restaurantes e pizzarias",
  "PDV para minimercados",
  "Sites profissionais",
];

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-transparent text-zinc-100">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl rounded-2xl bg-black/50 px-6 py-10 backdrop-blur-sm md:px-8 md:py-12">
            <h1 className="text-contrast-strong text-neon-strong mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Soluções digitais para mercados, restaurantes e pequenos negócios
            </h1>
            <p className="text-contrast text-neon mb-10 text-lg leading-relaxed text-zinc-200 md:text-xl">
              Criamos aplicativos, sistemas PDV, automações e sites profissionais.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Falar no WhatsApp
            </a>
          </div>
        </section>

        {/* Serviços */}
        <section id="servicos" className="border-t border-zinc-800/80 bg-zinc-950/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-contrast text-neon mb-12 text-2xl font-semibold text-white md:text-3xl">
              Nossos serviços
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICOS.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
                >
                  <p className="font-medium text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tecnologia — fundo escuro estilo tech */}
        <section className="border-t border-zinc-800/80 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-black/90 px-8 py-16 backdrop-blur-sm md:px-12 md:py-20">
              <h2 className="text-contrast text-neon mb-4 text-2xl font-semibold text-white md:text-3xl">
                Tecnologia que entrega resultado
              </h2>
              <p className="max-w-2xl text-zinc-400">
                Desenvolvemos sob medida para o seu negócio: PDV, gestão de estoque, automação de pedidos e presença digital profissional. Tudo integrado e pensado para mercados, restaurantes e pequenos negócios.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-800/80 py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="mb-6 text-zinc-300">Pronto para modernizar seu negócio?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Falar no WhatsApp
            </a>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-zinc-800/80 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-zinc-500">
          CYNIX — desenvolvimento de software
        </div>
      </footer>

      <AiSalesAgent />
    </div>
  );
}
