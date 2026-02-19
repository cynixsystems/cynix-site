"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const STORAGE_SESSION = "cynix-sales-agent-session";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(STORAGE_SESSION);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(STORAGE_SESSION, id);
  }
  return id;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ApiResponse {
  reply: string;
  leadCaptured?: boolean;
}

export function AiSalesAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => getSessionId());
  const listEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const wasLoading = useRef(false);
  useEffect(() => {
    if (wasLoading.current && !loading && open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
    wasLoading.current = loading;
  }, [loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setError(null);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-sales-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar. Tente de novo.");
        setLoading(false);
        return;
      }

      const payload = data as ApiResponse;

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: payload.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-chat-toggle
        aria-label={open ? "Fechar assistente" : "Abrir assistente comercial"}
        className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-6"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="flex h-full max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/20">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Assistente comercial CYNIX</h2>
                  <p className="text-xs text-zinc-400">Soluções digitais sob medida</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Fechar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800/90 px-4 py-3 text-sm leading-relaxed text-zinc-100">
                    Olá! Sou o assistente comercial da CYNIX. Posso entender seu negócio e sugerir a melhor solução digital?
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-emerald-600 text-white"
                        : "rounded-tl-sm bg-zinc-800/90 text-zinc-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-zinc-800/90 px-4 py-3">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={listEndRef} />
            </div>

            {error && (
              <div className="shrink-0 border-t border-zinc-800 bg-red-950/30 px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="shrink-0 border-t border-zinc-800 p-4">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className="min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
