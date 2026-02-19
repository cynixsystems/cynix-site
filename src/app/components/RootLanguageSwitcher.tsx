"use client";

import Image from "next/image";
import Link from "next/link";

const LOCALES = [
  { code: "pt-BR", flag: "/flags/br.svg", label: "Português" },
  { code: "en", flag: "/flags/us.svg", label: "English" },
  { code: "es", flag: "/flags/es.svg", label: "Español" },
] as const;

export function RootLanguageSwitcher() {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Selecionar idioma">
      {LOCALES.map(({ code, flag, label }) => (
        <Link
          key={code}
          href={`/${code}`}
          className="
            flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full
            opacity-70 transition-all duration-200 ease-out
            hover:scale-110 hover:opacity-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950
          "
          title={label}
          aria-label={label}
        >
          <Image
            src={flag}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
