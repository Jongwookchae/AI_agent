import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI aGENIEnt — Crypto Wish Funding",
  description:
    "AI-powered crypto wish funding agent. Turn birthday wishes into shareable onchain funding goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🧞</span>
            <span className="font-bold text-lg text-white">AI aGENIEnt</span>
          </a>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-400">Crypto Wish Funding Agent</span>
          <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
            MVP · Mock Funding
          </span>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-800 text-center text-xs text-slate-600 py-6 mt-12">
          AI aGENIEnt © 2026 · Built on Flock.io · All funding is mock data in MVP
        </footer>
      </body>
    </html>
  );
}
