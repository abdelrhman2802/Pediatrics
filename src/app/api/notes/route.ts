import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { topicNotes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const deviceId = sp.get("deviceId");
  const topicKey = sp.get("topicKey");
  if (!deviceId || !topicKey) return NextResponse.json({ body: "" });
  const [row] = await db.select().from(topicNotes).where(and(eq(topicNotes.deviceId, deviceId), eq(topicNotes.topicKey, topicKey)));
  return NextResponse.json({ body: row?.body ?? "" });
}

export async function PUT(req: Request) {
  const { deviceId, topicKey, body } = (await req.json()) as { deviceId?: string; topicKey?: string; body?: string };
  if (!deviceId || !topicKey || typeof body !== "string") return NextResponse.json({ error: "bad request" }, { status: 400 });
  await db
    .insert(topicNotes)
    .values({ deviceId, topicKey, body: body.slice(0, 8000) })
    .onConflictDoUpdate({ target: [topicNotes.deviceId, topicNotes.topicKey], set: { body: body.slice(0, 8000), updatedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
