import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Cynix - Sites profissionais e aplicativos sob medida para seu negócio",
  description: "Desenvolvimento de sites de alto impacto e sistemas sob medida para pequenas e médias empresas: mini mercados, restaurantes, padarias, postos e controle financeiro. Tecnologia que vende mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <div className="fixed inset-0 bg-black/40 -z-10" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
