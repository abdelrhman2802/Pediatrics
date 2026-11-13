import type { Metadata } from "next";
import { Atlas } from "@/components/Atlas";

export const metadata: Metadata = { title: "Visual Lab" };

export default function AtlasPage() {
  return <Atlas />;
}
