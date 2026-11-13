"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "motion/react";
import { HeartPulse, Lightbulb } from "lucide-react";
import { CHAPTER_META } from "@/lib/meta";

const PEARLS = CHAPTER_META.flatMap((m) => m.pearls.map((p) => ({ p, ch: m.short, hue: m.hue })));
const START = Math.max(0, PEARLS.findIndex((x) => x.p.startsWith("Jaundice in the first 24")));
const CARD = "absolute rounded-2xl border border-white/15 bg-ink/85 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl";

function Count({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.4, delay: 0.6, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to]);
  return <>{v}</>;
}

// Overlay cards sit inside the image frame on small screens and overhang it on large ones,
// so nothing is clipped by the hero's overflow.
export function HeroCards() {
  const [i, setI] = useState(START);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % PEARLS.length), 6500);
    return () => clearInterval(t);
  }, []);
  const cur = PEARLS[i];
  return (
    <>
      <div style={{ ["--h" as string]: cur.hue }} className={`${CARD} right-3 top-3 w-52 lg:-right-4 lg:top-8 lg:w-60`}>
        <div className="flex items-center gap-2 text-xs text-amber">
          <Lightbulb className="size-3.5 shrink-0" /> Pearl · <span className="accent-text truncate">{cur.ch}</span>
        </div>
        <div className="mt-2 min-h-[5.5rem]">
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="text-sm leading-snug text-snow">
              {cur.p}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-2 h-0.5 overflow-hidden rounded bg-white/10">
          <motion.div key={i} className="accent-grad h-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6.5, ease: "linear" }} />
        </div>
      </div>

      <div className={`${CARD} bottom-3 left-3 w-52 lg:-bottom-6 lg:-left-8 lg:w-60`}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-mist">Apgar at 1 min</span>
          <span className="flex items-center gap-1 text-rose">
            <HeartPulse className="size-3.5" style={{ animation: "beat 1s ease-in-out infinite" }} /> 142 bpm
          </span>
        </div>
        <div className="display mt-1 text-4xl">
          <Count to={8} />
          <span className="text-xl text-mist">/10</span>
        </div>
        <svg viewBox="0 0 240 40" className="mt-1 h-10 w-full text-aqua" aria-hidden>
          <path d="M0 22H70l6-5 6 5h10l6-18 8 34 7-24 5 8h22l6-4 6 4H240" pathLength={1} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 22H70l6-5 6 5h10l6-18 8 34 7-24 5 8h22l6-4 6 4H240" pathLength={1} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="ecg-run" />
        </svg>
      </div>
    </>
  );
}
