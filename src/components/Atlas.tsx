"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Area, ComposedChart, CartesianGrid, Line, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import type { ReactNode } from "react";

function Panel({ title, kicker, children, hue = 28 }: { title: string; kicker: string; children: ReactNode; hue?: number }) {
  return (
    <section style={{ ["--h" as string]: hue }} className="glass p-6 md:p-8">
      <p className="eyebrow accent-text">{kicker}</p>
      <h2 className="display mt-1 text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* ---------- 1. Growth charts ---------- */
const CURVES = {
  weight: { unit: "kg", label: "Weight-for-age", ages: [0, 3, 6, 9, 12, 18, 24, 36], p3: [2.5, 5.0, 6.4, 7.1, 7.7, 8.8, 9.7, 11.3], p50: [3.3, 6.4, 7.9, 8.9, 9.6, 10.9, 12.2, 14.3], p97: [4.3, 7.9, 9.8, 10.9, 11.8, 13.5, 15.3, 18.3], note: "Book rule: +750 g/month for 4 months (≈6 kg), +500 g/month to 8 months (≈8 kg), +250 g/month to 12 months (≈9 kg)." },
  length: { unit: "cm", label: "Length/height-for-age", ages: [0, 3, 6, 9, 12, 18, 24, 36], p3: [46.3, 57.3, 63.3, 67.5, 71.0, 76.9, 81.7, 88.7], p50: [49.9, 61.4, 67.6, 72.0, 75.7, 82.3, 87.8, 96.1], p97: [53.4, 65.5, 71.9, 76.5, 80.5, 87.7, 93.9, 103.5], note: "Book rule: 50 cm at birth, 59 cm at 3 months, 75 cm at 12 months, 87 cm at 2 years; then height = age × 5 + 80." },
  head: { unit: "cm", label: "Head circumference-for-age", ages: [0, 3, 6, 9, 12, 18, 24, 36], p3: [32.1, 38.0, 41.0, 42.9, 44.0, 45.4, 46.4, 47.5], p50: [34.5, 40.5, 43.3, 45.0, 46.1, 47.4, 48.3, 49.6], p97: [36.9, 43.0, 45.6, 47.1, 48.3, 49.8, 50.7, 52.0], note: "Book values: 35 cm at birth, 43 cm at 6 months, 45 cm at 1 year, 48.5 cm at 3 years. +2 cm/month for 3 months then +0.5 cm/month." },
} as const;

function interp(xs: readonly number[], ys: readonly number[], x: number) {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return ys[i - 1] + ((ys[i] - ys[i - 1]) * (x - xs[i - 1])) / (xs[i] - xs[i - 1]);
  return ys[ys.length - 1];
}

function GrowthLab() {
  const [k, setK] = useState<keyof typeof CURVES>("weight");
  const [age, setAge] = useState(9);
  const [val, setVal] = useState(8.2);
  const c = CURVES[k];
  const data = c.ages.map((a, i) => ({ age: a, p3: c.p3[i], p50: c.p50[i], p97: c.p97[i], band: [c.p3[i], c.p97[i]] as [number, number] }));
  const lo = interp(c.ages, c.p3, age);
  const hi = interp(c.ages, c.p97, age);
  const mid = interp(c.ages, c.p50, age);
  const zone = val < lo ? "Below the 3rd percentile — investigate" : val > hi ? "Above the 97th percentile — investigate" : "Within the normal 3rd–97th percentile range";
  const bad = val < lo || val > hi;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CURVES) as (keyof typeof CURVES)[]).map((x) => (
            <button key={x} onClick={() => { setK(x); setVal(Math.round(interp(CURVES[x].ages, CURVES[x].p50, age) * 10) / 10); }} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${k === x ? "accent-border accent-bg text-white" : "border-line text-mist"}`}>{x}</button>
          ))}
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ left: -10, right: 10 }}>
              <CartesianGrid stroke="rgb(255 255 255 / .06)" />
              <XAxis dataKey="age" type="number" domain={[0, 36]} ticks={[0, 6, 12, 18, 24, 30, 36]} stroke="#9aa7bd" fontSize={11} label={{ value: "months", position: "insideBottomRight", offset: -2, fill: "#9aa7bd", fontSize: 11 }} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#9aa7bd" fontSize={11} />
              <Tooltip contentStyle={{ background: "#161230", border: "1px solid rgb(255 255 255 / .1)", borderRadius: 12 }} />
              <Area dataKey="band" stroke="none" fill="oklch(0.78 0.14 28 / .18)" />
              <Line dataKey="p3" stroke="#ff6b8b" strokeDasharray="4 4" dot={false} name="3rd" />
              <Line dataKey="p50" stroke="#ffa27a" strokeWidth={2.5} dot={false} name="50th" />
              <Line dataKey="p97" stroke="#ffd166" strokeDasharray="4 4" dot={false} name="97th" />
              <Scatter data={[{ age, p50: val }]} dataKey="p50" fill="#b79bff" name="Your child" shape="star" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-mist">{c.label} · approximate WHO reference bands for illustration; {c.note}</p>
      </div>
      <div className="rounded-2xl border border-line bg-black/25 p-5">
        <h3 className="font-medium">Plot a child</h3>
        <label className="eyebrow mt-4 block">Age: {age} months</label>
        <input type="range" min={0} max={36} value={age} onChange={(e) => setAge(+e.target.value)} className="mt-2 w-full accent-[#ffa27a]" />
        <label className="eyebrow mt-4 block">{k} ({c.unit})</label>
        <input type="number" step="0.1" value={val} onChange={(e) => setVal(+e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-black/30 px-3 py-2 outline-none focus:border-white/30" />
        <div className={`mt-5 rounded-xl border p-4 text-sm ${bad ? "border-rose/50 bg-rose/10 text-rose" : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"}`}>{zone}</div>
        <p className="mt-3 text-sm text-mist">At {age} months: 3rd = {lo.toFixed(1)}, median = {mid.toFixed(1)}, 97th = {hi.toFixed(1)} {c.unit}.</p>
      </div>
    </div>
  );
}

/* ---------- 2. Milestones ---------- */
const MILESTONES = [
  { m: 0, gm: "Flexed posture, symmetric reflexes", fm: "Fists clenched, palmar grasp", lang: "Cries, startles to sound", soc: "Fixes on faces" },
  { m: 2, gm: "Lifts head when prone", fm: "Follows objects to midline", lang: "Coos", soc: "Social smile" },
  { m: 4, gm: "Head steady, no head lag, rolls front to back", fm: "Hands together, reaches", lang: "Laughs aloud, turns to voice", soc: "Recognises mother" },
  { m: 6, gm: "Sits with support, rolls both ways", fm: "Transfers objects, raking grasp", lang: "Babbles (ba, da)", soc: "Stranger awareness begins" },
  { m: 9, gm: "Sits without support, crawls, pulls to stand", fm: "Pincer grasp emerging", lang: "Mama/dada non-specific", soc: "Plays peek-a-boo" },
  { m: 12, gm: "Stands alone, walks with one hand held", fm: "Neat pincer grasp, releases cube", lang: "1–2 words with meaning", soc: "Waves bye-bye" },
  { m: 18, gm: "Walks alone, runs stiffly, climbs steps", fm: "Tower of 3–4 cubes, scribbles", lang: "10–25 words, points to body parts", soc: "Imitates domestic tasks" },
  { m: 24, gm: "Runs, kicks a ball, stairs 2 feet/step", fm: "Tower of 6 cubes, draws a line", lang: "2-word phrases, ~50 words", soc: "Parallel play" },
  { m: 36, gm: "Pedals tricycle, stairs alternating feet", fm: "Copies a circle, tower of 9 cubes", lang: "Full sentences, knows name & age", soc: "Cooperative play, toilet trained by day" },
];

function Milestones() {
  const [i, setI] = useState(4);
  const cur = MILESTONES[i];
  const rows: [string, string, string][] = [
    ["Gross motor", cur.gm, "oklch(0.8 0.14 28)"],
    ["Fine motor / adaptive", cur.fm, "oklch(0.8 0.14 285)"],
    ["Language", cur.lang, "oklch(0.8 0.14 38)"],
    ["Social", cur.soc, "oklch(0.8 0.14 355)"],
  ];
  return (
    <div>
      <input type="range" min={0} max={MILESTONES.length - 1} value={i} onChange={(e) => setI(+e.target.value)} className="w-full accent-[#b79bff]" />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-mist">{MILESTONES.map((x) => <span key={x.m} className={x === cur ? "text-white" : ""}>{x.m}m</span>)}</div>
      <div className="relative mt-6">
        <div className="absolute left-0 right-0 top-5 h-px bg-line" />
        <div className="grid grid-cols-4 gap-3">
          {rows.map(([t, v, col], k) => (
            <motion.div key={t + cur.m} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.06 }} className="relative rounded-2xl border border-line bg-black/25 p-4 max-md:col-span-2">
              <span className="absolute -top-1.5 left-4 size-3 rounded-full" style={{ background: col, boxShadow: `0 0 14px ${col}` }} />
              <div className="eyebrow mt-3" style={{ color: col }}>{t}</div>
              <p className="mt-2 text-sm leading-relaxed">{v}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-mist">Age {cur.m} months. Red flags: no social smile by 3 months · no sitting by 9 months · no walking by 18 months · no words by 16 months · any loss of skills.</p>
    </div>
  );
}

/* ---------- 3. Apgar ---------- */
const APGAR = [
  { k: "Appearance (colour)", o: ["Blue / pale", "Pink body, blue extremities", "Completely pink"] },
  { k: "Pulse (heart rate)", o: ["Absent", "< 100 /min", "> 100 /min"] },
  { k: "Grimace (reflex irritability)", o: ["No response", "Grimace", "Cry / cough / sneeze"] },
  { k: "Activity (muscle tone)", o: ["Limp", "Some flexion", "Active motion"] },
  { k: "Respiratory effort", o: ["Absent", "Slow, irregular", "Good, strong cry"] },
];

function Apgar() {
  const [s, setS] = useState([2, 2, 2, 2, 1]);
  const total = s.reduce((a, b) => a + b, 0);
  const band = total >= 7 ? { t: "Normal — routine care", c: "#34d399" } : total >= 4 ? { t: "Moderately depressed — stimulation, oxygen, consider ventilation", c: "#ffd166" } : { t: "Severely depressed — immediate resuscitation", c: "#ff6b8b" };
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-3">
        {APGAR.map((a, r) => (
          <div key={a.k} className="rounded-2xl border border-line bg-black/20 p-3">
            <div className="text-sm font-medium">{a.k}</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {a.o.map((o, v) => (
                <button key={v} onClick={() => setS((x) => x.map((y, z) => (z === r ? v : y)))} className={`rounded-lg border px-2 py-2 text-xs transition ${s[r] === v ? "border-aqua/70 bg-aqua/15 text-white" : "border-line text-mist hover:text-white"}`}><b className="mr-1 font-mono">{v}</b>{o}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-black/25 p-6 text-center">
        <svg viewBox="0 0 120 70" className="w-56">
          <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="rgb(255 255 255 / .1)" strokeWidth="10" strokeLinecap="round" />
          <motion.path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke={band.c} strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="1" animate={{ strokeDashoffset: 1 - total / 10 }} transition={{ type: "spring", stiffness: 80 }} />
        </svg>
        <div className="display -mt-10 text-6xl">{total}<span className="text-xl text-mist">/10</span></div>
        <p className="mt-4 text-sm" style={{ color: band.c }}>{band.t}</p>
        <p className="mt-3 text-xs text-mist">Scored at 1 and 5 minutes. A 5-min score of 0–3 indicates severe asphyxia.</p>
      </div>
    </div>
  );
}

/* ---------- 4. Kramer ---------- */
const ZONES = [
  { z: 1, name: "Head & neck", bili: "≈ 4–8 mg/dL", y: 44, h: 38 },
  { z: 2, name: "Upper trunk (to umbilicus)", bili: "≈ 5–12 mg/dL", y: 82, h: 40 },
  { z: 3, name: "Lower trunk & thighs", bili: "≈ 8–16 mg/dL", y: 122, h: 44 },
  { z: 4, name: "Arms & lower legs", bili: "≈ 11–18 mg/dL", y: 166, h: 40 },
  { z: 5, name: "Palms & soles", bili: "> 15 mg/dL", y: 206, h: 22 },
];

function Kramer() {
  const [z, setZ] = useState(2);
  return (
    <div className="grid items-center gap-6 md:grid-cols-[14rem_1fr]">
      <svg viewBox="0 0 160 240" className="mx-auto w-48">
        <defs>
          <linearGradient id="jy" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fde047" /><stop offset="1" stopColor="#f59e0b" /></linearGradient>
        </defs>
        <circle cx="80" cy="26" r="20" fill={z >= 1 ? "url(#jy)" : "#2a3347"} />
        <rect x="52" y="48" width="56" height="74" rx="22" fill={z >= 2 ? "url(#jy)" : "#2a3347"} />
        <rect x="56" y="118" width="48" height="48" rx="16" fill={z >= 3 ? "url(#jy)" : "#2a3347"} />
        <rect x="26" y="52" width="22" height="82" rx="11" fill={z >= 4 ? "url(#jy)" : "#2a3347"} />
        <rect x="112" y="52" width="22" height="82" rx="11" fill={z >= 4 ? "url(#jy)" : "#2a3347"} />
        <rect x="58" y="160" width="20" height="56" rx="10" fill={z >= 4 ? "url(#jy)" : "#2a3347"} />
        <rect x="82" y="160" width="20" height="56" rx="10" fill={z >= 4 ? "url(#jy)" : "#2a3347"} />
        <circle cx="37" cy="140" r="9" fill={z >= 5 ? "url(#jy)" : "#2a3347"} />
        <circle cx="123" cy="140" r="9" fill={z >= 5 ? "url(#jy)" : "#2a3347"} />
        <ellipse cx="68" cy="224" rx="12" ry="7" fill={z >= 5 ? "url(#jy)" : "#2a3347"} />
        <ellipse cx="92" cy="224" rx="12" ry="7" fill={z >= 5 ? "url(#jy)" : "#2a3347"} />
      </svg>
      <div>
        <div className="space-y-2">
          {ZONES.map((x) => (
            <button key={x.z} onClick={() => setZ(x.z)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition ${z === x.z ? "border-amber/70 bg-amber/10 text-white" : "border-line text-mist hover:text-white"}`}>
              <span><b className="mr-2 font-mono">Zone {x.z}</b>{x.name}</span>
              <span className="font-mono text-xs">{x.bili}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-mist">Kramer’s rule: jaundice progresses cephalo-caudally. Visual estimates are unreliable, so measure TSB (or transcutaneous bilirubin) — and remember: jaundice visible in the <b className="text-white">first 24 hours is always pathological</b>.</p>
      </div>
    </div>
  );
}

/* ---------- 5. Fontanelle ---------- */
function Skull() {
  const [on, setOn] = useState<"ant" | "post" | null>("ant");
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <svg viewBox="0 0 220 260" className="mx-auto w-56">
        <ellipse cx="110" cy="130" rx="86" ry="112" fill="#141b2b" stroke="rgb(255 255 255 / .25)" strokeWidth="2" />
        <path d="M110 18 V242 M30 112 Q110 96 190 112" stroke="rgb(255 255 255 / .22)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <polygon points="110,84 134,112 110,140 86,112" fill={on === "ant" ? "#ffa27a" : "#2a3d4a"} stroke="#ffa27a" onMouseEnter={() => setOn("ant")} onClick={() => setOn("ant")} className="cursor-pointer transition" />
        <polygon points="110,222 120,238 100,238" fill={on === "post" ? "#b79bff" : "#2d2a45"} stroke="#b79bff" onMouseEnter={() => setOn("post")} onClick={() => setOn("post")} className="cursor-pointer" />
        <text x="110" y="116" textAnchor="middle" fontSize="9" fill="#0f0b24">ANT</text>
        <text x="110" y="258" textAnchor="middle" fontSize="9" fill="#b79bff">POST</text>
        <circle cx="64" cy="90" r="3" fill="#fff" opacity=".4" /><circle cx="156" cy="90" r="3" fill="#fff" opacity=".4" />
      </svg>
      <div className="text-sm">
        {on === "ant" && (<div><h3 className="display text-2xl text-aqua">Anterior fontanelle</h3><p className="mt-2 text-mist">Diamond-shaped, between frontal and parietal bones. Size at birth ≈ 2 × 2 cm. Normally closes at <b className="text-white">9–18 months</b>.</p><ul className="mt-3 space-y-1.5 text-mist"><li>▸ Late closure: rickets, hypothyroidism, Down syndrome, raised ICP, achondroplasia</li><li>▸ Bulging: meningitis, hydrocephalus, raised ICP</li><li>▸ Sunken: dehydration</li><li>▸ Early closure: craniosynostosis, microcephaly</li></ul></div>)}
        {on === "post" && (<div><h3 className="display text-2xl text-iris">Posterior fontanelle</h3><p className="mt-2 text-mist">Triangular, between the parietal and occipital bones. Often fingertip-sized or closed at birth; closes by <b className="text-white">2–3 months</b>.</p><ul className="mt-3 space-y-1.5 text-mist"><li>▸ Open beyond 4 months suggests hypothyroidism or raised ICP</li></ul></div>)}
        <p className="mt-4 text-xs text-mist">Hover or tap a fontanelle.</p>
      </div>
    </div>
  );
}

/* ---------- 6. Dehydration plans ---------- */
function Plans() {
  const plans = [
    { p: "A", t: "No dehydration", d: "Alert, drinks normally, normal skin pinch, tears present.", a: "Home: extra fluids, continue feeding, zinc 10–14 days, warning signs.", c: "#34d399" },
    { p: "B", t: "Some dehydration", d: "Restless/irritable, sunken eyes, thirsty, slow skin pinch.", a: "ORS 75 mL/kg over 4 hours at the facility, reassess, then Plan A.", c: "#ffd166" },
    { p: "C", t: "Severe dehydration", d: "Lethargic/unconscious, very sunken eyes, unable to drink, very slow pinch.", a: "IV Ringer’s lactate / saline 100 mL/kg (30 then 70) — reassess frequently.", c: "#ff6b8b" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((x) => (
        <div key={x.p} className="rounded-2xl border bg-black/25 p-5" style={{ borderColor: x.c + "66" }}>
          <div className="display text-5xl" style={{ color: x.c }}>Plan {x.p}</div>
          <h3 className="mt-2 font-medium">{x.t}</h3>
          <p className="mt-2 text-sm text-mist">{x.d}</p>
          <p className="mt-3 border-t border-line pt-3 text-sm">{x.a}</p>
        </div>
      ))}
    </div>
  );
}

export function Atlas() {
  const toc = useMemo(() => ["Growth charts", "Milestones", "Apgar", "Jaundice", "Fontanelles", "Dehydration"], []);
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <p className="eyebrow">Illustrated · interactive</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">The <span className="text-grad">Visual Lab</span>.</h1>
      <p className="mt-4 max-w-2xl text-mist">Six interactive figures that turn the highest-yield tables of the curriculum into things you can touch: {toc.join(" · ")}.</p>
      <div className="mt-10 space-y-6">
        <Panel kicker="Chapter 1 · Growth & Development" title="Percentile growth charts" hue={172}><GrowthLab /></Panel>
        <Panel kicker="Chapter 1 · Development" title="Milestone scrubber" hue={285}><Milestones /></Panel>
        <Panel kicker="Chapter 5 · The Newborn" title="Apgar score calculator" hue={200}><Apgar /></Panel>
        <Panel kicker="Chapter 5 · Neonatal jaundice" title="Kramer’s rule body map" hue={55}><Kramer /></Panel>
        <Panel kicker="Chapter 1 · Fontanelles" title="Infant skull & fontanelles" hue={320}><Skull /></Panel>
        <Panel kicker="Chapter 10 · Gastrointestinal" title="WHO dehydration plans" hue={12}><Plans /></Panel>
      </div>
    </div>
  );
}
