import Link from "next/link";
import { ArrowRight, BookOpenCheck, FlaskConical, ListChecks, Sparkles } from "lucide-react";
import { chapters, totals } from "@/lib/curriculum";
import { CHAPTER_META } from "@/lib/meta";
import { QUESTIONS } from "@/lib/questions";
import { ChapterArt } from "@/components/ChapterArt";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { HeroCards } from "@/components/HeroCards";

export default function Home() {
  const t = totals();
  const stats = [
    { v: t.chapters, l: "Chapters" },
    { v: t.sections, l: "Topics" },
    { v: Math.round(t.words / 1000) + "k", l: "Words of notes" },
    { v: QUESTIONS.length, l: "MCQs" },
  ];
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-x-clip">
        <div className="gridlines absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2"><Sparkles className="size-3.5 text-aqua" /> Undergraduate pediatric medicine · complete curriculum</p>
            <h1 className="display text-[clamp(2.6rem,6.2vw,5.4rem)] font-medium leading-[0.98]">
              Every child is a <span className="text-grad">different</span> patient.
              <br />Learn pediatrics that way.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
              Nineteen chapters from growth charts to PALS, rebuilt as an illustrated, searchable atlas — with an interactive visual lab and a bank of {QUESTIONS.length}+ exam-style MCQs that tracks your weak spots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/curriculum" className="accent-grad flex items-center gap-2 rounded-full px-6 py-3 font-medium text-ink transition hover:scale-[1.03]">Open the curriculum <ArrowRight className="size-4" /></Link>
              <Link href="/qbank" className="glass flex items-center gap-2 !rounded-full px-6 py-3 font-medium transition hover:border-white/30">Start a quiz <ListChecks className="size-4" /></Link>
            </div>
            <div className="mt-12 grid max-w-xl grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="display text-3xl text-white">{s.v}</div>
                  <div className="eyebrow mt-1 !text-[.6rem]">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-aqua/20 via-iris/20 to-rose/20 blur-3xl" />
              <div className="glass animate-float overflow-hidden !rounded-[2rem] p-2">
                <img src="/images/hero.jpg" alt="Illustration of a child, heartbeat line and DNA helix in neon light" className="aspect-[4/3] w-full rounded-[1.6rem] object-cover" />
              </div>
              <HeroCards />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-line py-4" aria-hidden>
        <div className="flex w-max animate-[marq_60s_linear_infinite] gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-mist/70">
          {[...chapters, ...chapters].map((c, i) => (
            <span key={i} className="flex items-center gap-10">{c.title}<span className="text-aqua">✦</span></span>
          ))}
        </div>
        <style>{`@keyframes marq{to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* CHAPTERS */}
      <section className="mx-auto max-w-7xl px-5 pt-24">
        <Reveal>
          <p className="eyebrow">The full syllabus</p>
          <h2 className="display mt-3 max-w-2xl text-4xl md:text-5xl">Nineteen chapters, one continuous clinical story.</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c, i) => {
            const m = CHAPTER_META[c.n - 1];
            return (
              <Reveal key={c.n} delay={(i % 3) * 0.06}>
                <Link href={`/curriculum/${c.n}`} style={{ ["--h" as string]: m.hue }} className="glass card-hover group relative block overflow-hidden">
                  <ChapterArt n={c.n} hue={m.hue} className="h-36 w-full opacity-90 transition group-hover:scale-105" />
                  <div className="p-5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow accent-text">Chapter {String(c.n).padStart(2, "0")}</span>
                      <span className="accent-bg accent-text grid size-9 place-items-center rounded-xl"><Icon name={m.icon} className="size-[18px]" /></span>
                    </div>
                    <h3 className="display mt-2 text-2xl leading-tight">{m.short}</h3>
                    <p className="mt-1.5 text-sm text-mist">{m.tagline}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-mist">
                      <span>{c.sections.length} topics</span>
                      <span className="flex items-center gap-1 transition group-hover:translate-x-1 group-hover:text-white">Explore <ArrowRight className="size-3.5" /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* TRIO */}
      <section className="mx-auto mt-28 grid max-w-7xl gap-5 px-5 lg:grid-cols-3">
        {[
          { href: "/curriculum", icon: BookOpenCheck, t: "Structured notes", d: "Every topic from the book, restructured with headings, nested bullets, definitions and an outline you can jump around.", h: 28 },
          { href: "/atlas", icon: FlaskConical, t: "Interactive visual lab", d: "Growth curves, Apgar calculator, Kramer’s jaundice figure, fontanelle map and a milestone timeline you can scrub.", h: 285 },
          { href: "/qbank", icon: ListChecks, t: `${QUESTIONS.length}+ MCQs`, d: "Practice or timed exam mode with explanations, bookmarks, chapter filters and analytics saved to your device.", h: 355 },
        ].map((f, i) => (
          <Reveal key={f.t} delay={i * 0.08}>
            <Link href={f.href} style={{ ["--h" as string]: f.h }} className="glass card-hover block h-full p-7">
              <span className="accent-bg accent-text grid size-12 place-items-center rounded-2xl"><f.icon className="size-6" /></span>
              <h3 className="display mt-5 text-2xl">{f.t}</h3>
              <p className="mt-2 text-mist">{f.d}</p>
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5">
        <Reveal>
          <div className="glass relative overflow-hidden !rounded-[2rem]">
            <img src="/images/qbank.jpg" alt="Neon multiple choice cards floating over a study desk" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
            <div className="relative max-w-xl p-10 md:p-16">
              <p className="eyebrow">Question bank</p>
              <h2 className="display mt-3 text-4xl md:text-5xl">Test yourself until the book feels obvious.</h2>
              <p className="mt-4 text-mist">Clinical vignettes and one-best-answer MCQs mapped chapter by chapter, with a rationale for every option.</p>
              <Link href="/qbank" className="accent-grad mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-ink">Begin practice <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
