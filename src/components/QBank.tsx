"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, BookmarkCheck, Check, ChevronLeft, ChevronRight, Clock, Flag, RotateCcw, Shuffle, Timer, X } from "lucide-react";
import { QUESTIONS, type Question } from "@/lib/questions";
import { CHAPTER_META } from "@/lib/meta";
import { getDeviceId } from "@/lib/device";

type Mode = "practice" | "exam";
type Phase = "setup" | "run" | "result";
const LETTERS = ["A", "B", "C", "D", "E"];

function shuffle<T>(a: T[]) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function QBank({ initialCh }: { initialCh: number | null }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<Mode>("practice");
  const [chs, setChs] = useState<number[]>(initialCh ? [initialCh] : []);
  const [diff, setDiff] = useState<0 | 1 | 2 | 3>(0);
  const [count, setCount] = useState(20);
  const [source, setSource] = useState<"all" | "bookmarked" | "missed">("all");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [deck, setDeck] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<(number | null)[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [secs, setSecs] = useState(0);
  const [saved, setSaved] = useState<null | "saving" | "saved" | "error">(null);
  const qStart = useRef(Date.now());
  const device = useRef("");

  useEffect(() => {
    device.current = getDeviceId();
    fetch(`/api/bookmarks?deviceId=${device.current}`).then((r) => r.json()).then((j) => setBookmarks(j.ids ?? [])).catch(() => {});
    fetch(`/api/attempts?deviceId=${device.current}`)
      .then((r) => r.json())
      .then((j) => {
        const wrong = new Set<string>();
        for (const a of j.attempts ?? []) for (const x of a.answers ?? []) if (x.a !== null && x.a !== x.c) wrong.add(x.q);
        setMissed([...wrong]);
      })
      .catch(() => {});
  }, []);

  const pool = useMemo(
    () =>
      QUESTIONS.filter(
        (q) =>
          (chs.length === 0 || chs.includes(q.ch)) &&
          (diff === 0 || q.d === diff) &&
          (source === "all" || (source === "bookmarked" ? bookmarks.includes(q.id) : missed.includes(q.id))),
      ),
    [chs, diff, source, bookmarks, missed],
  );

  const examLimit = deck.length * 60;
  useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const finish = useCallback(
    async (d: Question[], a: (number | null)[], t: number[], duration: number) => {
      setPhase("result");
      setSaved("saving");
      try {
        const r = await fetch("/api/attempts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            deviceId: device.current || getDeviceId(),
            mode,
            scope: chs.length ? chs.map((c) => `Ch${c}`).join(",") : "All chapters",
            durationSec: duration,
            answers: d.map((q, k) => ({ q: q.id, c: q.a, a: a[k] ?? null, ch: q.ch, t: t[k] ?? 0 })),
          }),
        });
        setSaved(r.ok ? "saved" : "error");
      } catch {
        setSaved("error");
      }
    },
    [mode, chs],
  );

  useEffect(() => {
    if (phase === "run" && mode === "exam" && deck.length && secs >= examLimit) finish(deck, ans, times, secs);
  }, [secs, phase, mode, deck, ans, times, examLimit, finish]);

  const start = (pick?: Question[]) => {
    const chosen = pick ?? shuffle(pool).slice(0, Math.min(count, pool.length));
    if (!chosen.length) return;
    setDeck(chosen);
    setAns(chosen.map(() => null));
    setTimes(chosen.map(() => 0));
    setI(0);
    setSecs(0);
    setSaved(null);
    qStart.current = Date.now();
    setPhase("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (k: number) => {
    if (mode === "practice" && ans[i] !== null) return;
    setAns((a) => a.map((v, x) => (x === i ? k : v)));
    setTimes((t) => t.map((v, x) => (x === i ? v + Math.round((Date.now() - qStart.current) / 1000) : v)));
  };
  const go = (n: number) => {
    qStart.current = Date.now();
    setI(Math.max(0, Math.min(deck.length - 1, n)));
  };

  const toggleBookmark = async (id: string) => {
    setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
    await fetch("/api/bookmarks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ deviceId: device.current || getDeviceId(), questionId: id }) }).catch(() => {});
  };

  useEffect(() => {
    if (phase !== "run") return;
    const k = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4", "a", "b", "c", "d"].indexOf(e.key.toLowerCase());
      if (idx >= 0) choose(idx % 4);
      if (e.key === "ArrowRight" || e.key === "Enter") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  /* ---------------- SETUP ---------------- */
  if (phase === "setup") {
    const toggle = (n: number) => setChs((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]));
    return (
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <p className="eyebrow">Question bank · {QUESTIONS.length} MCQs</p>
        <h1 className="display mt-3 text-5xl md:text-6xl">Build your <span className="text-grad">quiz</span>.</h1>
        <p className="mt-4 max-w-2xl text-mist">Mix chapters, choose practice mode (instant explanations) or exam mode (timed, scored at the end). Every attempt is saved to your progress dashboard.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Chapters</h2>
              <button onClick={() => setChs([])} className="text-xs text-mist hover:text-white">{chs.length === 0 ? "All chapters selected" : "Clear selection"}</button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {CHAPTER_META.map((m) => {
                const n = QUESTIONS.filter((q) => q.ch === m.n).length;
                const on = chs.includes(m.n);
                return (
                  <button key={m.n} onClick={() => toggle(m.n)} style={{ ["--h" as string]: m.hue }} className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${on ? "accent-border accent-bg text-white" : "border-line bg-white/[.02] text-mist hover:text-white"}`}>
                    <span className="flex items-center gap-2.5"><span className="accent-text font-mono text-xs">{String(m.n).padStart(2, "0")}</span>{m.short}</span>
                    <span className="font-mono text-xs opacity-70">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass p-6">
              <h2 className="font-medium">Mode</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["practice", "exam"] as Mode[]).map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`rounded-xl border px-3 py-3 text-sm capitalize transition ${mode === m ? "border-aqua/60 bg-aqua/10 text-white" : "border-line text-mist"}`}>
                    {m === "practice" ? <Check className="mx-auto mb-1 size-4" /> : <Timer className="mx-auto mb-1 size-4" />}{m}
                  </button>
                ))}
              </div>
              <h2 className="mt-5 font-medium">Difficulty</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {([[0, "All"], [1, "Easy"], [2, "Medium"], [3, "Hard"]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setDiff(v)} className={`rounded-full border px-3.5 py-1.5 text-sm ${diff === v ? "border-iris/60 bg-iris/15 text-white" : "border-line text-mist"}`}>{l}</button>
                ))}
              </div>
              <h2 className="mt-5 font-medium">Source</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {([["all", "All"], ["bookmarked", `Bookmarked (${bookmarks.length})`], ["missed", `Previously missed (${missed.length})`]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setSource(v)} className={`rounded-full border px-3.5 py-1.5 text-sm ${source === v ? "border-rose/60 bg-rose/15 text-white" : "border-line text-mist"}`}>{l}</button>
                ))}
              </div>
              <h2 className="mt-5 font-medium">Number of questions</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[10, 20, 40, 100, 9999].map((n) => (
                  <button key={n} onClick={() => setCount(n)} className={`rounded-full border px-3.5 py-1.5 text-sm ${count === n ? "border-amber/60 bg-amber/15 text-white" : "border-line text-mist"}`}>{n === 9999 ? "All" : n}</button>
                ))}
              </div>
            </div>
            <div className="glass p-6 text-center">
              <div className="display text-5xl">{Math.min(count, pool.length)}</div>
              <p className="eyebrow mt-1">questions · {pool.length} match</p>
              <button disabled={!pool.length} onClick={() => start()} className="accent-grad mt-5 w-full rounded-full py-3 font-medium text-ink transition enabled:hover:scale-[1.02] disabled:opacity-40">Start {mode} quiz</button>
              {mode === "exam" && <p className="mt-3 text-xs text-mist">Timed: 60 seconds per question.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- RUN ---------------- */
  const q = deck[i];
  if (phase === "run" && q) {
    const m = CHAPTER_META[q.ch - 1];
    const picked = ans[i];
    const reveal = mode === "practice" && picked !== null;
    const done = ans.filter((x) => x !== null).length;
    return (
      <div style={{ ["--h" as string]: m.hue }} className="mx-auto max-w-3xl px-5 pt-10">
        <div className="flex items-center justify-between text-sm text-mist">
          <button onClick={() => { if (confirm("Quit this quiz? Progress will not be saved.")) setPhase("setup"); }} className="flex items-center gap-1 hover:text-white"><X className="size-4" /> Quit</button>
          <span className="font-mono">{i + 1} / {deck.length}</span>
          <span className="flex items-center gap-1.5 font-mono"><Clock className="size-4" />{mode === "exam" ? fmt(Math.max(0, examLimit - secs)) : fmt(secs)}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div className="accent-grad h-full" animate={{ width: `${((i + 1) / deck.length) * 100}%` }} /></div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="glass mt-6 p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow accent-text">Ch {q.ch} · {m.short} · {["", "Easy", "Medium", "Hard"][q.d]}</span>
              <button onClick={() => toggleBookmark(q.id)} aria-label="Bookmark question" className="text-mist hover:text-amber">
                {bookmarks.includes(q.id) ? <BookmarkCheck className="size-5 text-amber" /> : <Bookmark className="size-5" />}
              </button>
            </div>
            <h2 className="mt-4 text-xl leading-snug md:text-[1.4rem]">{q.q}</h2>
            <div className="mt-6 space-y-3">
              {q.o.map((o, k) => {
                const isPicked = picked === k;
                const right = reveal && k === q.a;
                const wrong = reveal && isPicked && k !== q.a;
                return (
                  <button key={k} onClick={() => choose(k)} className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${right ? "border-emerald-400/70 bg-emerald-400/10" : wrong ? "border-rose/70 bg-rose/10" : isPicked ? "accent-border accent-bg" : "border-line bg-white/[.02] hover:border-white/25 hover:bg-white/[.05]"}`}>
                    <span className={`grid size-7 flex-none place-items-center rounded-lg border font-mono text-xs ${right ? "border-emerald-400 text-emerald-300" : wrong ? "border-rose text-rose" : "border-line text-mist"}`}>{right ? <Check className="size-4" /> : wrong ? <X className="size-4" /> : LETTERS[k]}</span>
                    <span className="pt-0.5">{o}</span>
                  </button>
                );
              })}
            </div>
            {reveal && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border border-line bg-black/30 p-4 text-sm">
                <b className={picked === q.a ? "text-emerald-300" : "text-rose"}>{picked === q.a ? "Correct." : `Incorrect — the answer is ${LETTERS[q.a]}.`}</b>
                <p className="mt-1 text-mist">{q.e}</p>
                <Link href={`/curriculum/${q.ch}`} className="accent-text mt-2 inline-block text-xs hover:underline">Review Chapter {q.ch} →</Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => go(i - 1)} disabled={i === 0} className="glass flex items-center gap-1 !rounded-full px-5 py-2.5 text-sm disabled:opacity-30"><ChevronLeft className="size-4" /> Prev</button>
          <span className="eyebrow">{done} answered</span>
          {i < deck.length - 1 ? (
            <button onClick={() => go(i + 1)} className="glass flex items-center gap-1 !rounded-full px-5 py-2.5 text-sm">Next <ChevronRight className="size-4" /></button>
          ) : (
            <button onClick={() => finish(deck, ans, times, secs)} className="accent-grad flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium text-ink"><Flag className="size-4" /> Finish</button>
          )}
        </div>
        {mode === "exam" && i < deck.length - 1 && <button onClick={() => finish(deck, ans, times, secs)} className="mx-auto mt-4 block text-xs text-mist hover:text-white">Submit exam now</button>}
        <p className="mt-6 text-center text-xs text-mist/60">Keys: A–D or 1–4 to answer · ← → to navigate</p>
      </div>
    );
  }

  /* ---------------- RESULT ---------------- */
  const correct = deck.filter((x, k) => ans[k] === x.a).length;
  const pct = Math.round((correct / Math.max(1, deck.length)) * 100);
  const byCh = Object.entries(
    deck.reduce<Record<number, { c: number; t: number }>>((acc, x, k) => {
      acc[x.ch] ??= { c: 0, t: 0 };
      acc[x.ch].t++;
      if (ans[k] === x.a) acc[x.ch].c++;
      return acc;
    }, {}),
  );
  const R = 54;
  const C = 2 * Math.PI * R;
  return (
    <div className="mx-auto max-w-4xl px-5 pt-12">
      <div className="glass grid items-center gap-8 p-8 md:grid-cols-[auto_1fr]">
        <div className="relative mx-auto size-40">
          <svg viewBox="0 0 128 128" className="-rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" stroke="rgb(255 255 255 / .08)" strokeWidth="10" />
            <motion.circle cx="64" cy="64" r={R} fill="none" stroke="url(#rg)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct / 100) }} transition={{ duration: 1.2 }} />
            <defs><linearGradient id="rg"><stop offset="0" stopColor="#ffa27a" /><stop offset="1" stopColor="#b79bff" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center"><div className="text-center"><div className="display text-4xl">{pct}%</div><div className="eyebrow !text-[.55rem]">score</div></div></div>
        </div>
        <div>
          <p className="eyebrow">{mode} quiz complete</p>
          <h1 className="display mt-2 text-4xl">{correct} of {deck.length} correct</h1>
          <p className="mt-2 text-mist">{pct >= 80 ? "Excellent — exam-ready on this material." : pct >= 60 ? "Solid. Review the missed questions below." : "Keep going — revisit the chapters flagged below."} Time: {fmt(secs)}. {saved === "saved" && "Saved to your progress."}{saved === "error" && "Could not save attempt."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => setPhase("setup")} className="glass flex items-center gap-2 !rounded-full px-5 py-2.5 text-sm"><Shuffle className="size-4" /> New quiz</button>
            {correct < deck.length && <button onClick={() => start(deck.filter((x, k) => ans[k] !== x.a))} className="accent-grad flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink"><RotateCcw className="size-4" /> Retry {deck.length - correct} missed</button>}
            <Link href="/progress" className="glass !rounded-full px-5 py-2.5 text-sm">View progress</Link>
          </div>
        </div>
      </div>

      <div className="glass mt-6 p-6">
        <h2 className="font-medium">By chapter</h2>
        <div className="mt-4 space-y-3">
          {byCh.map(([ch, v]) => {
            const m = CHAPTER_META[Number(ch) - 1];
            const p = Math.round((v.c / v.t) * 100);
            return (
              <div key={ch} style={{ ["--h" as string]: m.hue }}>
                <div className="flex justify-between text-sm"><Link href={`/curriculum/${ch}`} className="hover:underline">Ch {ch} · {m.short}</Link><span className="font-mono text-mist">{v.c}/{v.t}</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10"><div className="accent-grad h-full" style={{ width: `${p}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="display mt-10 text-2xl">Answer review</h2>
      <div className="mt-4 space-y-3">
        {deck.map((x, k) => {
          const ok = ans[k] === x.a;
          return (
            <details key={x.id} className="glass group p-4" open={!ok}>
              <summary className="flex cursor-pointer list-none items-start gap-3">
                <span className={`mt-0.5 grid size-6 flex-none place-items-center rounded-full ${ok ? "bg-emerald-400/20 text-emerald-300" : "bg-rose/20 text-rose"}`}>{ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}</span>
                <span className="text-sm leading-snug"><span className="font-mono text-xs text-mist">Q{k + 1} · Ch {x.ch}</span><br />{x.q}</span>
              </summary>
              <div className="mt-3 space-y-1.5 pl-9 text-sm">
                {x.o.map((o, z) => (
                  <div key={z} className={z === x.a ? "text-emerald-300" : z === ans[k] ? "text-rose" : "text-mist"}>{LETTERS[z]}. {o} {z === x.a && "✓"}{z === ans[k] && z !== x.a && "(your answer)"}</div>
                ))}
                <p className="pt-2 text-snow/80">{x.e}</p>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
