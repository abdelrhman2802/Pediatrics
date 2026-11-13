import type { Metadata } from "next";
import { QBank } from "@/components/QBank";

export const metadata: Metadata = { title: "Question bank" };

export default async function QBankPage({ searchParams }: { searchParams: Promise<{ ch?: string }> }) {
  const { ch } = await searchParams;
  const n = Number(ch);
  return <QBank initialCh={n >= 1 && n <= 19 ? n : null} />;
}
