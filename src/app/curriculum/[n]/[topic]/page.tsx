import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ListChecks } from "lucide-react";
import { chapters, getSection } from "@/lib/curriculum";
import { CHAPTER_META } from "@/lib/meta";
import { Content, outline } from "@/components/Content";
import { Notes } from "@/components/Notes";
import { TopicBanner } from "@/components/TopicBanner";
import { AtAGlance } from "@/components/AtAGlance";

export function generateStaticParams() {
  return chapters.flatMap((c) => c.sections.map((s) => ({ n: String(c.n), topic: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string; topic: string }> }): Promise<Metadata> {
  const { n, topic } = await params;
  const r = getSection(Number(n), topic);
  return { title: r ? r.section.title : "Topic" };
}

export default async function TopicPage({ params }: { params: Promise<{ n: string; topic: string }> }) {
  const { n, topic } = await params;
  const r = getSection(Number(n), topic);
  if (!r) notFound();
  const { chapter: c, section: s, index, prev, next } = r;
  const m = CHAPTER_META[c.n - 1];
  const out = outline(s.blocks);
  return (
    <div style={{ ["--h" as string]: m.hue }} className="mx-auto grid max-w-[88rem] gap-8 px-5 pt-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_15rem]">
      {/* topic list */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <Link href={`/curriculum/${c.n}`} className="eyebrow accent-text flex items-center gap-2 hover:underline"><ArrowLeft className="size-3.5" /> Chapter {c.n}</Link>
          <div className="display mt-1 text-xl leading-tight">{m.short}</div>
          <nav className="mt-4 space-y-0.5 border-l border-line">
            {c.sections.map((x, i) => (
              <Link key={x.id} href={`/curriculum/${c.n}/${x.id}`} className={`-ml-px block border-l py-1.5 pl-4 text-sm transition ${i === index ? "accent-border accent-text font-medium" : "border-transparent text-mist hover:text-white"}`}>
                {x.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <article className="min-w-0">
        <div className="eyebrow">Chapter {c.n} · {c.title} · topic {index + 1}/{c.sections.length} · book p.{s.page}</div>
        <h1 className="display mt-3 text-4xl leading-[1.05] md:text-5xl">{s.title}</h1>
        <TopicBanner n={c.n} hue={m.hue} icon={m.icon} index={index} total={c.sections.length} />
        <AtAGlance blocks={s.blocks} />
        <div className="glass mt-8 p-6 md:p-9">
          {s.blocks.length ? <Content blocks={s.blocks} /> : <p className="text-mist">See the preceding topic for the full discussion.</p>}
        </div>
        <div className="mt-6"><Notes topicKey={`${c.n}/${s.id}`} /></div>
        <Link href={`/qbank?ch=${c.n}`} className="glass card-hover mt-6 flex items-center justify-between p-5">
          <span className="flex items-center gap-3"><ListChecks className="size-5 accent-text" /> Check your understanding — practice Chapter {c.n} MCQs</span>
          <ArrowRight className="size-4" />
        </Link>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {prev ? <Link href={`/curriculum/${c.n}/${prev.id}`} className="glass card-hover p-5"><span className="eyebrow">← Previous</span><div className="mt-1 font-medium">{prev.title}</div></Link> : <span />}
          {next ? <Link href={`/curriculum/${c.n}/${next.id}`} className="glass card-hover p-5 text-right"><span className="eyebrow">Next →</span><div className="mt-1 font-medium">{next.title}</div></Link> : <span />}
        </div>
      </article>

      {out.length > 1 && (
        <aside className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="eyebrow mb-3">On this page</div>
            <ul className="space-y-1.5 border-l border-line pl-4 text-sm">
              {out.map((o) => (
                <li key={o.id}><a href={`#${o.id}`} className={`block leading-snug hover:text-white ${o.major ? "text-snow" : "pl-3 text-mist"}`}>{o.text}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
