// Generative, animated per-chapter illustration: orbiting rings, twinkling nodes and a
// pulse travelling along the chapter's wave. Seeded by `n`, so every card is unique.
export function ChapterArt({ n, hue, className = "" }: { n: number; hue: number; className?: string }) {
  const rnd = (i: number) => {
    const x = Math.sin(n * 91.7 + i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const pts = Array.from({ length: 11 }, (_, i) => ({ x: 20 + rnd(i) * 260, y: 14 + rnd(i + 40) * 112, r: 2 + rnd(i + 80) * 5 }));
  const c1 = `oklch(0.82 0.14 ${hue})`;
  const c2 = `oklch(0.7 0.18 ${(hue + 70) % 360})`;
  const id = `g${n}`;
  const rings = 3 + (n % 3);
  const wave = `M0 ${100 + (n % 4) * 5} Q 40 ${70 - (n % 3) * 10} 75 100 T 150 96 T 225 86 T 300 104`;
  const box = { transformBox: "fill-box" as const, transformOrigin: "center" };
  return (
    <svg viewBox="0 0 300 140" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <radialGradient id={`${id}r`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={c1} stopOpacity=".45" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={60 + (n % 5) * 40} cy="70" r="70" fill={`url(#${id}r)`} className="twinkle" style={{ animationDuration: "7s" }} />
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={210 - (n % 4) * 14} cy="70" r={18 + i * 14} fill="none" stroke={`url(#${id})`} strokeWidth="1" opacity={0.7 - i * 0.12} strokeDasharray={i % 2 ? "3 5" : "none"} style={{ ...box, animation: `orbit ${26 + i * 10}s linear infinite ${i % 2 ? "reverse" : ""}` }} />
      ))}
      {pts.map((p, i) => (i > 0 ? <line key={`l${i}`} x1={pts[i - 1].x} y1={pts[i - 1].y} x2={p.x} y2={p.y} stroke={c1} strokeOpacity=".22" /> : null))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={i % 3 === 0 ? `url(#${id})` : "none"} stroke={c1} strokeOpacity=".7" className="twinkle" style={{ animationDelay: `${(i * 370) % 3000}ms` }} />
      ))}
      <path d={wave} fill="none" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" />
      <circle r="3.5" fill="#fff">
        <animateMotion dur={`${5 + (n % 4)}s`} repeatCount="indefinite" path={wave} />
      </circle>
    </svg>
  );
}
