"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ConversationState, LeadState } from "@/lib/chat/types";

const STORAGE_KEY_MESSAGES = "cynix-chat-messages";
const STORAGE_KEY_LEAD = "cynix-chat-lead-state";
const STORAGE_KEY_CONVERSATION = "cynix-chat-conversation-state";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatApiResponse {
  message: string;
  updates: Partial<LeadState>;
  canCalculate: boolean;
  showCheckoutButton: boolean;
  checkoutUrl?: string;
  conversationState: ConversationState;
}

const defaultConversationState: ConversationState = {
  isQualified: false,
  readyForProposal: false,
  readyToClose: false,
  stage: "discovery",
};

function safeParseJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    safeParseJson<ChatMessage[]>(STORAGE_KEY_MESSAGES, [])
  );
  const [leadState, setLeadState] = useState<Partial<LeadState>>(() =>
    safeParseJson<Partial<LeadState>>(STORAGE_KEY_LEAD, {})
  );
  const [conversationState, setConversationState] = useState<ConversationState>(() => {
    const stored = safeParseJson<Partial<ConversationState>>(STORAGE_KEY_CONVERSATION, {});
    return {
      ...defaultConversationState,
      ...stored,
      stage: stored.stage ?? "discovery",
      isQualified: stored.isQualified ?? false,
      readyForProposal: stored.readyForProposal ?? false,
      readyToClose: stored.readyToClose ?? false,
    };
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string>("/checkout");
  const showCheckoutButton = conversationState.readyToClose;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Manter foco no campo de mensagem após cada resposta do assistente (evita ter que clicar de novo)
  const wasLoading = useRef(false);
  useEffect(() => {
    if (wasLoading.current && !loading && open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
    wasLoading.current = loading;
  }, [loading, open]);

  useEffect(() => {
    safeSetItem(STORAGE_KEY_MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    safeSetItem(STORAGE_KEY_LEAD, leadState);
  }, [leadState]);

  useEffect(() => {
    safeSetItem(STORAGE_KEY_CONVERSATION, conversationState);
  }, [conversationState]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          state: leadState,
          conversationState,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar mensagem.");
        setLoading(false);
        return;
      }

      const payload = data as ChatApiResponse;

      setLeadState((prev) => ({ ...prev, ...payload.updates }));
      setConversationState(payload.conversationState);
      if (payload.checkoutUrl) setCheckoutUrl(payload.checkoutUrl);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: payload.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#09090b]"
        aria-label={open ? "Fechar chat" : "Abrir chat"}
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
        <div className="fixed bottom-24 right-6 z-40 flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#09090b] shadow-xl">
          <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Atendimento Cynix</h3>
            <p className="text-xs text-zinc-400">Olá! Estamos aqui para ajudar. Conte o que você precisa que a gente te guia.</p>
          </div>

          <div className="flex max-h-[60vh] min-h-[280px] flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-100">
                      Olá! Tudo bem? Sou o assistente da Cynix e fico feliz em ajudar. O que você precisa hoje?
                    </div>
                  </div>
                  <p className="text-center text-sm text-zinc-500">Escolha uma opção ou digite sua mensagem:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => sendMessage("Quero um site")}
                      className="rounded-lg border border-zinc-600 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-200 transition hover:border-blue-500 hover:bg-zinc-700"
                    >
                      Quero um site
                    </button>
                    <button
                      type="button"
                      onClick={() => sendMessage("Quero um aplicativo ou sistema")}
                      className="rounded-lg border border-zinc-600 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-200 transition hover:border-blue-500 hover:bg-zinc-700"
                    >
                      Quero um aplicativo
                    </button>
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-400">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="border-t border-zinc-800 bg-red-950/30 px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            {showCheckoutButton && (
              <div className="border-t border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <a
                  href={checkoutUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  <span>Ir para checkout</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-3">
              <div className="flex gap-2">
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
                  className="min-h-[40px] flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
