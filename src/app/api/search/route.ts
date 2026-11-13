import { NextResponse } from "next/server";
import { search } from "@/lib/curriculum";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  return NextResponse.json({ hits: search(q.slice(0, 80)) });
}
