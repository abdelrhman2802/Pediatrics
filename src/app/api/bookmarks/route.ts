import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const deviceId = new URL(req.url).searchParams.get("deviceId");
  if (!deviceId) return NextResponse.json({ ids: [] });
  const rows = await db.select({ q: bookmarks.questionId }).from(bookmarks).where(eq(bookmarks.deviceId, deviceId));
  return NextResponse.json({ ids: rows.map((r) => r.q) });
}

// Toggle a bookmark on/off
export async function POST(req: Request) {
  const { deviceId, questionId } = (await req.json()) as { deviceId?: string; questionId?: string };
  if (!deviceId || !questionId) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const existing = await db.select().from(bookmarks).where(and(eq(bookmarks.deviceId, deviceId), eq(bookmarks.questionId, questionId)));
  if (existing.length) {
    await db.delete(bookmarks).where(and(eq(bookmarks.deviceId, deviceId), eq(bookmarks.questionId, questionId)));
    return NextResponse.json({ bookmarked: false });
  }
  await db.insert(bookmarks).values({ deviceId, questionId });
  return NextResponse.json({ bookmarked: true });
}
