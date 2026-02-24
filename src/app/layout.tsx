import type { Metadata } from "next";
import { Cinzel, IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Reaper Botany",
  description: "Reaper Botany dispensary commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${ibmPlexMono.variable} antialiased`}>
        <div className="rb-shell rb-page-frame">
          <div
            aria-hidden
            className="rb-float pointer-events-none fixed right-[-90px] top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(174,224,114,0.22)_0%,_rgba(174,224,114,0)_70%)] blur-xl"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed bottom-[-120px] left-[-90px] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(104,165,77,0.18)_0%,_rgba(104,165,77,0)_70%)] blur-xl"
          />
          <SiteHeader />
          <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">{children}</main>
          <footer className="mt-14 border-t border-[#2a3a2a] bg-[rgba(10,18,12,0.65)]">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-[#9ab194] md:px-8">
              <p>Reaper Botany. Curated flower, crafted concentrates, and trusted delivery.</p>
              <p className="font-mono">For adults 21+ only.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
