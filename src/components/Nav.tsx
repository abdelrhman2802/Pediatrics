"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";

type Hit = { n: number; id: string; chapter: string; title: string; snippet: string };

const links = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/atlas", label: "Visual Lab" },
  { href: "/qbank", label: "Question Bank" },
  { href: "/progress", label: "My Progress" },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffa27a" />
            <stop offset="1" stopColor="#b79bff" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="rgb(255 255 255 / .04)" stroke="url(#lg)" />
        <path d="M6 22h7l3-9 5 17 4-12 2 4h7" fill="none" stroke="url(#lg)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="display text-lg leading-none">
        Pedia<span className="text-grad">Atlas</span>
      </span>
    </span>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    setBusy(true);
    const t = setTimeout(async () => {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const j = await r.json();
      setHits(j.hits);
      setBusy(false);
    }, 180);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="glass w-full max-w-2xl overflow-hidden !bg-ink-2/95" initial={{ y: -20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="size-5 text-mist" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search every topic: “kernicterus”, “Jones criteria”, “ORS”…" className="w-full bg-transparent text-base outline-none placeholder:text-mist/60" />
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-mist hover:text-white"><X className="size-5" /></button>
        </div>
        <div className="max-h-[56vh] overflow-y-auto p-2">
          {q.trim().length < 2 && <p className="p-5 text-sm text-mist">Type at least two letters to search the full pediatric curriculum.</p>}
          {busy && <p className="p-5 text-sm text-mist">Searching…</p>}
          {!busy && q.trim().length >= 2 && hits.length === 0 && <p className="p-5 text-sm text-mist">No topic matched.</p>}
          {hits.map((h) => (
            <button key={h.n + h.id} onClick={() => { router.push(`/curriculum/${h.n}/${h.id}`); onClose(); }} className="block w-full rounded-xl p-3 text-left transition hover:bg-white/5">
              <div className="eyebrow">Ch {h.n} · {h.chapter}</div>
              <div className="mt-0.5 font-medium">{h.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-mist">{h.snippet}</div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" aria-label="PediaAtlas home"><Logo /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = path.startsWith(l.href);
              return (
                <Link key={l.href} href={l.href} className={`relative rounded-full px-4 py-2 text-sm transition ${active ? "text-white" : "text-mist hover:text-white"}`}>
                  {active && <motion.span layoutId="navpill" className="absolute inset-0 -z-10 rounded-full border border-line bg-white/8" />}
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full border border-line bg-white/5 px-3.5 py-2 text-sm text-mist transition hover:text-white">
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
            </button>
            <button className="rounded-full border border-line p-2 md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Menu">{menu ? <X className="size-5" /> : <Menu className="size-5" />}</button>
          </div>
        </div>
        {menu && (
          <div className="border-t border-line px-5 py-3 md:hidden">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="block py-2.5 text-mist hover:text-white">{l.label}</Link>
            ))}
          </div>
        )}
      </header>
      <AnimatePresence>{open && <Palette onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
