import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <div className="fixed inset-0 bg-black/40 -z-10" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
