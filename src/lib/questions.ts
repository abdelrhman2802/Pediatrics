import { CH_A } from "@/data/questions/a";
import { CH_B } from "@/data/questions/b";
import { CH_C } from "@/data/questions/c";
import { CH_D } from "@/data/questions/d";
import { CH_E } from "@/data/questions/e";
import { CH_F } from "@/data/questions/f";

// Raw tuple: [stem, "optA|optB|optC|optD", correctIndex, explanation, difficulty]
export type Raw = [string, string, number, string, "e" | "m" | "h"];
export type Question = { id: string; ch: number; q: string; o: string[]; a: number; e: string; d: 1 | 2 | 3 };

const sources: Record<number, Raw[]> = { ...CH_A, ...CH_B, ...CH_C, ...CH_D, ...CH_E, ...CH_F };

// Deterministic seeded shuffle so correct answers are evenly distributed across A–D
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(id: string, opts: string[], correct: number) {
  let seed = 7;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  const rnd = mulberry(seed);
  const idx = opts.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { o: idx.map((i) => opts[i]), a: idx.indexOf(correct) };
}

export const QUESTIONS: Question[] = Object.entries(sources)
  .sort(([a], [b]) => Number(a) - Number(b))
  .flatMap(([ch, list]) =>
    list.map(([q, o, a, e, d], i) => {
      const id = `c${ch}-${i + 1}`;
      const s = shuffled(id, o.split("|").map((x) => x.trim()), a);
      return { id, ch: Number(ch), q, o: s.o, a: s.a, e, d: (d === "e" ? 1 : d === "m" ? 2 : 3) as 1 | 2 | 3 };
    }),
  );

export const byChapter = (n: number) => QUESTIONS.filter((q) => q.ch === n);
