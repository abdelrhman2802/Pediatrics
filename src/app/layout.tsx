import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: { default: "PediaAtlas — Undergraduate Pediatrics Curriculum & Question Bank", template: "%s · PediaAtlas" },
  description: "The complete undergraduate pediatric medicine curriculum — 19 chapters, 180+ topics, illustrated atlas and a 500+ MCQ question bank.",
};
export const viewport: Viewport = { themeColor: "#0f0b24" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="aurora" aria-hidden />
        <div className="grain" aria-hidden />
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
        <footer className="mt-32 border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-mist md:flex-row md:items-center md:justify-between">
            <p><span className="display text-base text-white">PediaAtlas</span> · built from the undergraduate Pediatrics college book, 19 chapters.</p>
            <div className="flex gap-5">
              <Link href="/curriculum" className="hover:text-white">Curriculum</Link>
              <Link href="/atlas" className="hover:text-white">Visual Lab</Link>
              <Link href="/qbank" className="hover:text-white">Question Bank</Link>
              <Link href="/progress" className="hover:text-white">Progress</Link>
            </div>
          </div>
          <p className="mx-auto max-w-7xl px-5 pb-8 text-xs text-mist/60">Educational use only. Always verify drug doses against current local guidelines before clinical use.</p>
        </footer>
      </body>
    </html>
  );
}
