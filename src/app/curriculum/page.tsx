import Link from "next/link";
import type { Metadata } from "next";
import { chapters } from "@/lib/curriculum";
import { CHAPTER_META } from "@/lib/meta";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Curriculum map" };

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14">
      <p className="eyebrow">Syllabus map</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">The whole <span className="text-grad">pediatrics</span> curriculum.</h1>
      <p className="mt-4 max-w-2xl text-mist">{chapters.length} chapters · {chapters.reduce((a, c) => a + c.sections.length, 0)} topics. Click any chip to jump straight to the topic, or press ⌘K to search the entire text.</p>
      <div className="mt-12 space-y-4">
        {chapters.map((c) => {
          const m = CHAPTER_META[c.n - 1];
          return (
            <Reveal key={c.n}>
              <section style={{ ["--h" as string]: m.hue }} className="glass grid gap-5 p-6 md:grid-cols-[16rem_1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="accent-bg accent-text grid size-11 place-items-center rounded-xl"><Icon name={m.icon} className="size-5" /></span>
                    <span className="display accent-text text-4xl">{String(c.n).padStart(2, "0")}</span>
                  </div>
                  <Link href={`/curriculum/${c.n}`} className="display mt-3 block text-2xl leading-tight hover:underline">{m.short}</Link>
                  <p className="mt-1 text-sm text-mist">{c.sections.length} topics · book p.{c.page}</p>
                </div>
                <div className="flex flex-wrap content-start gap-2">
                  {c.sections.map((s) => (
                    <Link key={s.id} href={`/curriculum/${c.n}/${s.id}`} className="rounded-full border border-line bg-white/[.03] px-3.5 py-1.5 text-sm text-mist transition hover:accent-border hover:bg-white/10 hover:text-white">
                      {s.title}
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
