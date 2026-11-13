import { ChapterArt } from "./ChapterArt";
import { Icon } from "./Icon";

// Animated banner for each topic: chapter-coloured generative art, a live ECG sweep,
// an orbiting chapter icon and a progress strip showing where this topic sits in the chapter.
export function TopicBanner({ n, hue, icon, index, total }: { n: number; hue: number; icon: string; index: number; total: number }) {
  const ring = `oklch(0.85 0.12 ${hue} / .5)`;
  return (
    <div className="relative mt-6 h-36 overflow-hidden rounded-3xl border border-line md:h-44" style={{ background: `linear-gradient(115deg, oklch(0.32 0.1 ${hue}), oklch(0.2 0.07 ${(hue + 70) % 360}))` }}>
      <ChapterArt n={n * 40 + index} hue={hue} className="absolute inset-0 h-full w-full scale-[1.8] opacity-70" />
      <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-14 w-full -translate-y-1/2" aria-hidden style={{ color: `oklch(0.9 0.12 ${hue})` }}>
        <path pathLength={1} className="ecg-run" d="M0 30H180l10-8 10 8h20l12-26 14 52 12-36 8 12h40l10-6 10 6H600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute right-6 top-1/2 grid size-24 -translate-y-1/2 place-items-center md:right-12 md:size-28" aria-hidden>
        <span className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: ring, animation: "orbit 24s linear infinite" }} />
        <span className="absolute inset-3 rounded-full border" style={{ borderColor: ring, animation: "orbit 16s linear infinite reverse" }} />
        <span className="absolute inset-0" style={{ animation: "orbit 9s linear infinite" }}>
          <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_white]" />
        </span>
        <span className="accent-bg accent-text accent-glow grid size-14 place-items-center rounded-2xl backdrop-blur"><Icon name={icon} className="size-7" /></span>
      </div>
      <div className="absolute bottom-4 left-5 flex items-center gap-1.5" role="img" aria-label={`Topic ${index + 1} of ${total}`}>
        {Array.from({ length: total }, (_, k) => (
          <span key={k} className={`h-1.5 rounded-full ${k === index ? "w-7 bg-white" : k < index ? "w-1.5 bg-white/70" : "w-1.5 bg-white/25"}`} />
        ))}
      </div>
    </div>
  );
}
