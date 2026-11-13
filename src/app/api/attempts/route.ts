import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { attempts, type AttemptAnswer } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const deviceId = new URL(req.url).searchParams.get("deviceId");
  if (!deviceId) return NextResponse.json({ attempts: [] });
  const rows = await db.select().from(attempts).where(eq(attempts.deviceId, deviceId)).orderBy(desc(attempts.createdAt)).limit(200);
  return NextResponse.json({ attempts: rows });
}

export async function POST(req: Request) {
  const b = (await req.json()) as {
    deviceId?: string; mode?: string; scope?: string; durationSec?: number; answers?: AttemptAnswer[];
  };
  if (!b.deviceId || !Array.isArray(b.answers) || !b.answers.length) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const answers = b.answers.slice(0, 600);
  const correct = answers.filter((a) => a.a === a.c).length;
  const [row] = await db
    .insert(attempts)
    .values({ deviceId: b.deviceId, mode: b.mode ?? "practice", scope: b.scope ?? "all", total: answers.length, correct, durationSec: Math.max(0, Math.round(b.durationSec ?? 0)), answers })
    .returning({ id: attempts.id });
  return NextResponse.json({ id: row.id, correct, total: answers.length });
}

export async function DELETE(req: Request) {
  const deviceId = new URL(req.url).searchParams.get("deviceId");
  if (!deviceId) return NextResponse.json({ error: "bad request" }, { status: 400 });
  await db.delete(attempts).where(eq(attempts.deviceId, deviceId));
  return NextResponse.json({ ok: true });
}
