"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Target, Trash2, Trophy, Zap } from "lucide-react";
import { getDeviceId } from "@/lib/device";
import { CHAPTER_META } from "@/lib/meta";
import type { AttemptAnswer } from "@/db/schema";

type Attempt = { id: number; mode: string; scope: string; total: number; correct: number; durationSec: number; answers: AttemptAnswer[]; createdAt: string };

export function Progress() {
  const [items, setItems] = useState<Attempt[] | null>(null);
  const load = () => {
    fetch(`/api/attempts?deviceId=${getDeviceId()}`).then((r) => r.json()).then((j) => setItems(j.attempts));
  };
  useEffect(load, []);

  const stats = useMemo(() => {
    const list = items ?? [];
    const total = list.reduce((a, x) => a + x.total, 0);
    const correct = list.reduce((a, x) => a + x.correct, 0);
    const per: Record<number, { c: number; t: number }> = {};
    for (const a of list) for (const x of a.answers) {
      if (x.a === null) continue;
      per[x.ch] ??= { c: 0, t: 0 };
      per[x.ch].t++;
      if (x.a === x.c) per[x.ch].c++;
    }
    const chapters = CHAPTER_META.map((m) => ({ n: m.n, name: `${m.n}`, short: m.short, hue: m.hue, t: per[m.n]?.t ?? 0, pct: per[m.n] ? Math.round((per[m.n].c / per[m.n].t) * 100) : 0 }));
    const trend = [...list].reverse().map((a, i) => ({ i: i + 1, pct: Math.round((a.correct / a.total) * 100) }));
    const weak = chapters.filter((c) => c.t >= 3).sort((a, b) => a.pct - b.pct).slice(0, 4);
    return { total, correct, chapters, trend, weak, best: list.length ? Math.max(...list.map((a) => Math.round((a.correct / a.total) * 100))) : 0 };
  }, [items]);

  if (!items) return <div className="mx-auto max-w-6xl px-5 pt-20 text-mist">Loading your progress…</div>;

  const reset = async () => {
    if (!confirm("Delete all saved quiz history on this device?")) return;
    await fetch(`/api/attempts?deviceId=${getDeviceId()}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <p className="eyebrow">Dashboard</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">Your <span className="text-grad">progress</span>.</h1>
      {items.length === 0 ? (
        <div className="glass mt-10 p-10 text-center">
          <p className="text-mist">No quiz attempts yet. Your scores and weak chapters will appear here after your first quiz.</p>
          <Link href="/qbank" className="accent-grad mt-5 inline-block rounded-full px-6 py-3 font-medium text-ink">Take a quiz</Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { l: "Quizzes taken", v: items.length, i: Zap },
              { l: "Questions answered", v: stats.total, i: Target },
              { l: "Overall accuracy", v: `${Math.round((stats.correct / Math.max(1, stats.total)) * 100)}%`, i: Trophy },
              { l: "Best score", v: `${stats.best}%`, i: Trophy },
            ].map((s) => (
              <div key={s.l} className="glass p-5"><s.i className="size-5 text-aqua" /><div className="display mt-3 text-4xl">{s.v}</div><div className="eyebrow mt-1">{s.l}</div></div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="glass p-6">
              <h2 className="font-medium">Score trend</h2>
              <div className="mt-4 h-60">
                <ResponsiveContainer>
                  <LineChart data={stats.trend}>
                    <CartesianGrid stroke="rgb(255 255 255 / .06)" />
                    <XAxis dataKey="i" stroke="#9aa7bd" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#9aa7bd" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#161230", border: "1px solid rgb(255 255 255 / .1)", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="pct" stroke="#ffa27a" strokeWidth={3} dot={{ r: 4, fill: "#b79bff" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass p-6">
              <h2 className="font-medium">Accuracy by chapter</h2>
              <div className="mt-4 h-60">
                <ResponsiveContainer>
                  <BarChart data={stats.chapters}>
                    <CartesianGrid stroke="rgb(255 255 255 / .06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#9aa7bd" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#9aa7bd" fontSize={11} />
                    <Tooltip cursor={{ fill: "rgb(255 255 255 / .04)" }} contentStyle={{ background: "#161230", border: "1px solid rgb(255 255 255 / .1)", borderRadius: 12 }} formatter={(v, _n, p) => [`${v}% (${(p.payload as { t: number }).t} answered)`, (p.payload as { short: string }).short]} labelFormatter={() => ""} />
                    <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                      {stats.chapters.map((c) => <Cell key={c.n} fill={`oklch(0.78 0.14 ${c.hue})`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {stats.weak.length > 0 && (
            <div className="glass mt-6 p-6">
              <h2 className="font-medium">Focus next on</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.weak.map((w) => (
                  <Link key={w.n} href={`/qbank?ch=${w.n}`} style={{ ["--h" as string]: w.hue }} className="card-hover rounded-xl border border-line p-4">
                    <div className="eyebrow accent-text">Chapter {w.n}</div>
                    <div className="mt-1 font-medium">{w.short}</div>
                    <div className="mt-2 text-sm text-mist">{w.pct}% accuracy · practice now →</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="glass mt-6 overflow-x-auto p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">History</h2>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-mist hover:text-rose"><Trash2 className="size-3.5" /> Clear</button>
            </div>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="eyebrow"><tr><th className="py-2">Date</th><th>Mode</th><th>Scope</th><th>Score</th><th>Time</th></tr></thead>
              <tbody>
                {items.slice(0, 15).map((a) => (
                  <tr key={a.id} className="border-t border-line text-mist">
                    <td className="py-2.5">{new Date(a.createdAt).toLocaleString()}</td>
                    <td className="capitalize">{a.mode}</td>
                    <td className="max-w-[12rem] truncate">{a.scope}</td>
                    <td className="font-mono text-white">{a.correct}/{a.total} ({Math.round((a.correct / a.total) * 100)}%)</td>
                    <td className="font-mono">{Math.floor(a.durationSec / 60)}:{String(a.durationSec % 60).padStart(2, "0")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
