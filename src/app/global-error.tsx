"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "system-ui", background: "#0a0a0a", color: "#f5f5f5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ textAlign: "center", maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Erro no site</h1>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>
            Algo deu errado. Clique no botão para recarregar.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#059669",
              color: "white",
              border: "none",
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
