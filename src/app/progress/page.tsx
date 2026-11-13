import type { Metadata } from "next";
import { Progress } from "@/components/Progress";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  return <Progress />;
}
