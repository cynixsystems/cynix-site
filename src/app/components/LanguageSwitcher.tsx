"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "../../i18n/navigation";

// Definimos as bandeiras como strings de emoji para garantir minimalismo e performance
const LOCALES = [
  { code: "pt-BR" as const, flag: "🇧🇷", label: "Português" },
  { code: "en" as const, flag: "🇺🇸", label: "English" },
  { code: "es" as const, flag: "🇪🇸", label: "Español" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Selecionar idioma">
      {LOCALES.map(({ code, flag, label }) => {
        const isActive = locale === code;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            className={`
              flex h-8 w-8 items-center justify-center rounded-md
              text-lg transition-all duration-200 ease-in-out
              hover:bg-zinc-800 hover:scale-110
              ${isActive 
                ? "bg-zinc-800 ring-1 ring-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                : "opacity-60 hover:opacity-100"
              }
            `}
            title={label}
            aria-label={label}
          >
            <span className="leading-none">{flag}</span>
          </Link>
        );
      })}
    </div>
  );
}
