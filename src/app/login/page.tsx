"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const ERRO_CONEXAO = "Não foi possível conectar ao servidor. Verifique sua internet ou se o Supabase está configurado no .env.local (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY).";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [redirect, setRedirect] = useState("/minha-area");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const r = searchParams.get("redirect");
    if (r && r.startsWith("/")) setRedirect(r);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed to fetch")) {
        setError(ERRO_CONEXAO);
      } else {
        setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      }
      return;
    }
    window.location.href = redirect;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-black/60 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-90">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold">C</span>
            <span className="text-lg font-semibold">Cynix</span>
          </Link>
        </div>
        <h1 className="text-contrast text-neon mb-2 text-xl font-semibold text-white">Entrar</h1>
        <p className="mb-6 text-sm text-zinc-400">Acesse sua área para acompanhar seus projetos.</p>
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Login está desativado até você configurar o Supabase no <strong>.env.local</strong> (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY). Reinicie o servidor após alterar.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-300">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-300">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-blue-400 hover:text-blue-300">Cadastre-se</Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-400">Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
