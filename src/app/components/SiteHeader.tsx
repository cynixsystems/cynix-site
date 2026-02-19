"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/supabase/auth";
import { signOut } from "@/lib/supabase/auth";
import { useLocale } from "next-intl";
import { Link } from "../../i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

const WHATSAPP_URL =
  "https://wa.me/5551995580969?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Cynix";

export function SiteHeader() {
  const { user, loading } = useAuth();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <Image
            src="/Gemini_Generated_Image_h033tph033tph033.png"
            alt="Cynix"
            width={140}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#solucoes" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            {t("solutions")}
          </a>
          <a href="#diferenciais" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            {t("differentiators")}
          </a>
          <a href="#metodologia" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            {t("howWeWork")}
          </a>
          <a href="#contato" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            {t("contact")}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 text-zinc-300 transition hover:bg-zinc-800 hover:text-white md:hidden"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="hidden md:flex md:items-center md:gap-3">
            <LanguageSwitcher />
            {loading ? (
              <span className="text-sm text-zinc-500">...</span>
            ) : user ? (
              <>
                <Link
                  href="/minha-area"
                  className="rounded-lg border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {t("myArea")}
                </Link>
                <button
                  onClick={() => signOut().then(() => (window.location.href = `/${locale}`))}
                  className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-zinc-600 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/cadastro"
                  className="rounded-lg border border-blue-500/60 bg-blue-600/90 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  {t("register")}
                </Link>
              </>
            )}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t("requestQuote")}
            </a>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-x-0 top-16 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-1 px-6 py-4">
              <a href="#solucoes" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
                {t("solutions")}
              </a>
              <a href="#diferenciais" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
                {t("differentiators")}
              </a>
              <a href="#metodologia" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
                {t("howWeWork")}
              </a>
              <a href="#contato" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
                {t("contact")}
              </a>
              <div className="mt-3 border-t border-zinc-800 pt-3">
                <LanguageSwitcher />
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {loading ? (
                  <span className="text-sm text-zinc-500">...</span>
                ) : user ? (
                  <>
                    <Link href="/minha-area" onClick={() => setMobileOpen(false)} className="rounded-lg border border-zinc-600 px-3 py-2.5 text-center text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white">
                      {t("myArea")}
                    </Link>
                    <button onClick={() => signOut().then(() => (window.location.href = `/${locale}`))} className="rounded-lg border border-zinc-600 px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white">
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg border border-zinc-600 px-3 py-2.5 text-center text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white">
                      {t("login")}
                    </Link>
                    <Link href="/cadastro" onClick={() => setMobileOpen(false)} className="rounded-lg border border-blue-500/60 bg-blue-600/90 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600">
                      {t("register")}
                    </Link>
                  </>
                )}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700">
                  {t("requestQuote")}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
