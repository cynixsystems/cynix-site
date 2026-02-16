"use client";

import Link from "next/link";
import { RequireAuth } from "../components/RequireAuth";

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-transparent">
        <header className="border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold">C</span>
              <span>Cynix</span>
            </Link>
            <Link href="/minha-area" className="text-sm text-zinc-400 hover:text-white">Minha área</Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-contrast text-neon mb-2 text-2xl font-semibold text-white">Checkout</h1>
          <p className="mb-8 text-zinc-400">Esta página será usada para fechar orçamentos e pagamentos. Por enquanto, solicite seu orçamento pelo WhatsApp ou pelo chat do site.</p>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-8">
            <p className="text-zinc-300">Integração com pagamento e resumo do pedido em breve.</p>
            <a
              href="https://wa.me/5551995580969?text=Olá!%20Gostaria%20de%20fechar%20um%20orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Solicitar orçamento pelo WhatsApp
            </a>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
