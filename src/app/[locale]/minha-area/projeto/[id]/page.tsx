"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RequireAuth } from "../../../../components/RequireAuth";
import { Link } from "../../../../../i18n/navigation";
import { useAuth } from "@/lib/supabase/auth";
import { fetchProjectById, fetchPreviewsByProject } from "@/lib/supabase/projects";
import type { Project } from "@/lib/supabase/projects";
import type { Preview } from "@/lib/supabase/projects";

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
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !id) {
      setLoading(false);
      return;
    }
    Promise.all([fetchProjectById(id, user.id), fetchPreviewsByProject(id)]).then(([p, prevs]) => {
      setProject(p ?? null);
      setPreviews(prevs);
      setLoading(false);
    });
  }, [user?.id, id]);

  const status = project?.status ?? "briefing";

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
        {loading ? (
          <p className="text-zinc-400">Carregando projeto...</p>
        ) : !project ? (
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-8 text-center text-zinc-400">
            <p>Projeto não encontrado.</p>
            <Link href="/minha-area" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
              ← Voltar para Minha área
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-contrast text-neon mb-6 text-2xl font-semibold text-white">
              {project.name}
            </h1>

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
              {previews.map((preview) => (
                <a
                  key={preview.id}
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
          </>
        )}
      </main>
    </div>
  );
}
