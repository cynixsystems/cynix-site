"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const ERRO_CONEXAO = "Não foi possível conectar ao servidor. Verifique sua internet ou se o Supabase está configurado no .env.local (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY).";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed to fetch")) {
        setError(ERRO_CONEXAO);
      } else {
        setError(error.message.includes("already registered") ? "Este e-mail já está cadastrado." : error.message);
      }
      return;
    }
    if (data?.user && !data.session) {
      setSuccess(true);
      return;
    }
    window.location.href = "/minha-area";
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-black/60 p-8 backdrop-blur-sm text-center">
          <h1 className="text-contrast text-neon mb-4 text-xl font-semibold text-white">Confirme seu e-mail</h1>
          <p className="mb-6 text-sm text-zinc-400">
            Enviamos um link de confirmação para <strong className="text-zinc-300">{email}</strong>. Abra seu e-mail e clique no link para ativar sua conta.
          </p>
          <Link href="/login" className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Ir para login
          </Link>
        </div>
      </div>
    );
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
        <h1 className="text-contrast text-neon mb-2 text-xl font-semibold text-white">Criar conta</h1>
        <p className="mb-6 text-sm text-zinc-400">Cadastre-se para acompanhar seus projetos e acessar prévias.</p>
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Cadastro e login estão desativados até você configurar o Supabase. No arquivo <strong>.env.local</strong> na raiz do projeto, preencha <strong>NEXT_PUBLIC_SUPABASE_URL</strong> e <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> com os dados do seu projeto em supabase.com (Project Settings → API). Depois reinicie o servidor.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-300">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Seu nome"
            />
          </div>
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
              minLength={6}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">Entrar</Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-400">Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
