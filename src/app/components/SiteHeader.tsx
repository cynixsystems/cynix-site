"use client";

import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth";
import { signOut } from "@/lib/supabase/auth";

const WHATSAPP_URL =
  "https://wa.me/5551995580969?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Cynix";

export function SiteHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
            C
          </div>
          <span className="text-lg font-semibold text-white">Cynix</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#solucoes" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Soluções
          </a>
          <a href="#diferenciais" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Diferenciais
          </a>
          <a href="#metodologia" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Como trabalhamos
          </a>
          <a href="#contato" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Contato
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-zinc-500">...</span>
          ) : user ? (
            <>
              <Link
                href="/minha-area"
                className="rounded-lg border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Minha área
              </Link>
              <button
                onClick={() => signOut().then(() => (window.location.href = "/"))}
                className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-lg border border-blue-500/60 bg-blue-600/90 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                Cadastrar
              </Link>
            </>
          )}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Solicitar orçamento
          </a>
        </div>
      </div>
    </header>
  );
}
