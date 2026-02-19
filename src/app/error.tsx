"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <h1 className="mb-4 text-xl font-semibold">Algo deu errado</h1>
      <p className="mb-6 max-w-md text-center text-zinc-400">
        Ocorreu um erro ao carregar esta página. Tente recarregar.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Tentar de novo
      </button>
    </div>
  );
}
