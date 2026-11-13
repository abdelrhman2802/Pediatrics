import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, Lightbulb, ListChecks, Target } from "lucide-react";
import { chapters, getChapter, words } from "@/lib/curriculum";
import { CHAPTER_META } from "@/lib/meta";
import { QUESTIONS } from "@/lib/questions";
import { ChapterArt } from "@/components/ChapterArt";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return chapters.map((c) => ({ n: String(c.n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const c = getChapter(Number(n));
  return { title: c ? `Ch ${c.n} · ${c.title}` : "Chapter" };
}

export default async function ChapterPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const c = getChapter(Number(n));
  if (!c) notFound();
  const m = CHAPTER_META[c.n - 1];
  const qCount = QUESTIONS.filter((q) => q.ch === c.n).length;
  const prev = getChapter(c.n - 1);
  const next = getChapter(c.n + 1);
  return (
    <div style={{ ["--h" as string]: m.hue }} className="mx-auto max-w-7xl px-5 pt-10">
      <Link href="/curriculum" className="inline-flex items-center gap-2 text-sm text-mist hover:text-white"><ArrowLeft className="size-4" /> All chapters</Link>
      <section className="glass relative mt-5 overflow-hidden !rounded-[2rem]">
        <ChapterArt n={c.n} hue={m.hue} className="absolute inset-0 h-full w-full scale-150 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
        <div className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="accent-bg accent-text accent-glow grid size-14 place-items-center rounded-2xl"><Icon name={m.icon} className="size-7" /></span>
              <span className="eyebrow accent-text">Chapter {String(c.n).padStart(2, "0")}</span>
            </div>
            <h1 className="display mt-5 text-5xl leading-[1.02] md:text-6xl">{c.title}</h1>
            <p className="mt-3 max-w-lg text-lg text-mist">{m.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/curriculum/${c.n}/${c.sections[0].id}`} className="accent-grad inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium text-ink">Start reading <ArrowRight className="size-4" /></Link>
              <Link href={`/qbank?ch=${c.n}`} className="glass inline-flex items-center gap-2 !rounded-full px-5 py-2.5"><ListChecks className="size-4" /> Practice {qCount} MCQs</Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-black/30 p-5 backdrop-blur">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><Target className="size-4 accent-text" /> Learning objectives</h2>
              <ul className="mt-3 space-y-2 text-sm text-mist">
                {m.objectives.map((o) => <li key={o} className="flex gap-2"><span className="accent-text">▸</span>{o}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {m.pearls.map((p, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div className="glass h-full p-5">
              <Lightbulb className="size-5 text-amber" />
              <p className="mt-3 text-sm leading-relaxed text-snow/90">{p}</p>
              <p className="eyebrow mt-3">High-yield pearl {i + 1}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <h2 className="display mt-16 text-3xl">Topics in this chapter</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.sections.map((s, i) => {
          const w = words(s);
          return (
            <Reveal key={s.id} delay={(i % 3) * 0.05}>
              <Link href={`/curriculum/${c.n}/${s.id}`} className="glass card-hover group flex h-full flex-col overflow-hidden p-5">
                <div className="-mx-5 -mt-5 mb-4 h-20 overflow-hidden"><ChapterArt n={c.n * 40 + i} hue={(m.hue + i * 14) % 360} className="h-full w-full opacity-80 transition duration-500 group-hover:scale-125" /></div>
                <span className="display accent-text text-3xl opacity-80">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-medium leading-snug">{s.title}</h3>
                <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-mist">
                  <span className="flex items-center gap-1"><Clock className="size-3.5" />{Math.max(1, Math.round(w / 200))} min</span>
                  <span>{w} words</span>
                  <ArrowRight className="ml-auto size-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-16 flex justify-between gap-4">
        {prev ? <Link href={`/curriculum/${prev.n}`} className="glass card-hover flex-1 p-5"><span className="eyebrow">← Previous chapter</span><div className="display mt-1 text-xl">{prev.title}</div></Link> : <span className="flex-1" />}
        {next ? <Link href={`/curriculum/${next.n}`} className="glass card-hover flex-1 p-5 text-right"><span className="eyebrow">Next chapter →</span><div className="display mt-1 text-xl">{next.title}</div></Link> : <span className="flex-1" />}
      </div>
    </div>
  );
}
