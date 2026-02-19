import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <h1 className="mb-4 text-xl font-semibold">Página não encontrada</h1>
      <p className="mb-6 text-zinc-400">A URL que você acessou não existe.</p>
      <Link
        href="/"
        className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
