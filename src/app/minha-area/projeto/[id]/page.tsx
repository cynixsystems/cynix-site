"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RequireAuth } from "@/app/components/RequireAuth";

const STATUS_STEPS = [
  { id: "briefing", label: "Em briefing" },
  { id: "desenvolvimento", label: "Em desenvolvimento" },
  { id: "revisao", label: "Em revisão" },
  { id: "entregue", label: "Entregue" },
];

export default function ProjetoPage() {
  return (
    <RequireAuth>
      <ProjetoContent />
    </RequireAuth>
  );
}

function ProjetoContent() {
  const params = useParams();
  const id = params.id as string;
  const status = "briefing";
  const previews: { title: string; url: string }[] = [];

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/minha-area" className="text-zinc-400 hover:text-white">← Voltar</Link>
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold">C</span>
            <span>Cynix</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-contrast text-neon mb-6 text-2xl font-semibold text-white">Projeto #{id}</h1>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">Status do desenvolvimento</h2>
          <div className="flex flex-wrap gap-4">
            {STATUS_STEPS.map((step, i) => {
              const currentIndex = STATUS_STEPS.findIndex((s) => s.id === status);
              const isActive = i === currentIndex;
              const isPast = i < currentIndex;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                    isActive ? "border-blue-500 bg-blue-500/10 text-blue-400" : isPast ? "border-zinc-600 bg-zinc-800/50 text-zinc-400" : "border-zinc-700 text-zinc-500"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/20 text-xs font-medium">{i + 1}</span>
                  {step.label}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">Prévias</h2>
          {previews.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-8 text-center text-zinc-500">
              As prévias do seu projeto aparecerão aqui conforme o desenvolvimento. Você receberá avisos quando houver novidades.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {previews.map((preview, i) => (
                <a
                  key={i}
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-zinc-800 bg-black/40 p-4 transition hover:border-blue-500/50"
                >
                  <p className="font-medium text-white">{preview.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">Clique para abrir preview</p>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
