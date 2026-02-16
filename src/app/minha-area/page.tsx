"use client";

import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth";
import { RequireAuth } from "../components/RequireAuth";
import { signOut } from "@/lib/supabase/auth";

const STATUS_LABELS: Record<string, string> = {
  briefing: "Em briefing",
  desenvolvimento: "Em desenvolvimento",
  revisao: "Em revisão",
  entregue: "Entregue",
};

export default function MinhaAreaPage() {
  return (
    <RequireAuth>
      <MinhaAreaContent />
    </RequireAuth>
  );
}

function MinhaAreaContent() {
  const { user } = useAuth();
  const projects: { id: string; name: string; status: string }[] = [];

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 text-white hover:opacity-90">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold">C</span>
            <span className="text-lg font-semibold">Cynix</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{user?.email}</span>
            <button
              onClick={() => signOut().then(() => window.location.href = "/")}
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-contrast text-neon mb-2 text-2xl font-semibold text-white">Minha área</h1>
        <p className="mb-8 text-zinc-400">Acompanhe o status dos seus projetos e acesse as prévias.</p>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-12 text-center">
            <p className="text-zinc-400">Você ainda não tem projetos.</p>
            <p className="mt-2 text-sm text-zinc-500">Quando fechar um orçamento conosco, ele aparecerá aqui com status e prévias.</p>
            <Link href="/#contato" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Falar com a Cynix
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/minha-area/projeto/${p.id}`}
                  className="block rounded-xl border border-zinc-800 bg-black/40 p-6 transition hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{p.name}</span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-200">
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
