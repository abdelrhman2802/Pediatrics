import { Sparkles } from "lucide-react";
import type { Block } from "@/lib/curriculum";

const RE = /^((?:\d+\.\s)?[^:.!?]{2,38}?)\s?:\s+(\S.{9,})$/;

// Pulls the first few "Label: explanation" lines of a topic into scannable tiles.
export function AtAGlance({ blocks }: { blocks: Block[] }) {
  const seen = new Set<string>();
  const items: { k: string; v: string }[] = [];
  for (const [t, lvl, text] of blocks) {
    if ((t !== "l" && t !== "p") || lvl > 1) continue;
    const m = text.match(RE);
    if (!m) continue;
    const k = m[1].replace(/^\d+\.\s/, "").trim();
    if (/^definition/i.test(k) || seen.has(k.toLowerCase())) continue;
    seen.add(k.toLowerCase());
    items.push({ k, v: m[2].length > 130 ? m[2].slice(0, 127).replace(/\s\S*$/, "") + "…" : m[2] });
    if (items.length === 6) break;
  }
  if (items.length < 3) return null;
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="accent-text size-4" /> At a glance</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((x, i) => (
          <div key={x.k} className="glass pop-in relative overflow-hidden p-4 pl-5" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="accent-grad absolute inset-y-0 left-0 w-1" />
            <div className="display accent-text text-lg leading-tight">{x.k}</div>
            <p className="mt-1 line-clamp-3 text-sm text-mist">{x.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
