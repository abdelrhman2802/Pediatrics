import raw from "@/data/curriculum.json";

export type Block = [type: "h" | "s" | "p" | "l", level: number, text: string];
export type Section = { id: string; title: string; page: number; blocks: Block[] };
export type Chapter = { n: number; title: string; page: number; sections: Section[] };

export const chapters = raw as unknown as Chapter[];

export const getChapter = (n: number) => chapters.find((c) => c.n === n);

export const getSection = (n: number, id: string) => {
  const c = getChapter(n);
  if (!c) return undefined;
  const i = c.sections.findIndex((s) => s.id === id);
  if (i < 0) return undefined;
  return { chapter: c, section: c.sections[i], index: i, prev: c.sections[i - 1], next: c.sections[i + 1] };
};

export const words = (s: Section) => s.blocks.reduce((a, b) => a + b[2].split(/\s+/).length, 0);

export const totals = () => {
  let sections = 0;
  let wordCount = 0;
  for (const c of chapters) {
    sections += c.sections.length;
    for (const s of c.sections) wordCount += words(s);
  }
  return { chapters: chapters.length, sections, words: wordCount };
};

export type SearchHit = { n: number; id: string; chapter: string; title: string; snippet: string; score: number };

export function search(q: string, limit = 24): SearchHit[] {
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const c of chapters) {
    for (const s of c.sections) {
      const title = s.title.toLowerCase();
      let score = 0;
      let snippet = "";
      for (const t of terms) {
        if (title.includes(t)) score += 20;
      }
      for (const b of s.blocks) {
        const low = b[2].toLowerCase();
        let matched = 0;
        for (const t of terms) if (low.includes(t)) matched++;
        if (matched) {
          score += matched * (b[0] === "h" || b[0] === "s" ? 4 : 1);
          if (!snippet && matched === terms.length) {
            const at = low.indexOf(terms[0]);
            const from = Math.max(0, at - 50);
            snippet = (from > 0 ? "…" : "") + b[2].slice(from, from + 160) + "…";
          }
        }
      }
      if (score > 0) hits.push({ n: c.n, id: s.id, chapter: c.title, title: s.title, snippet: snippet || s.blocks[0]?.[2].slice(0, 140) || "", score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
