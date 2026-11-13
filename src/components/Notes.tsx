"use client";
import { useEffect, useRef, useState } from "react";
import { NotebookPen } from "lucide-react";
import { getDeviceId } from "@/lib/device";

export function Notes({ topicKey }: { topicKey: string }) {
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const loaded = useRef(false);
  useEffect(() => {
    const d = getDeviceId();
    fetch(`/api/notes?deviceId=${d}&topicKey=${encodeURIComponent(topicKey)}`)
      .then((r) => r.json())
      .then((j) => {
        setBody(j.body ?? "");
        loaded.current = true;
      });
  }, [topicKey]);
  useEffect(() => {
    if (!loaded.current) return;
    setState("saving");
    const t = setTimeout(async () => {
      await fetch("/api/notes", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ deviceId: getDeviceId(), topicKey, body }) });
      setState("saved");
    }, 700);
    return () => clearTimeout(t);
  }, [body, topicKey]);
  return (
    <div className="glass p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-medium"><NotebookPen className="size-4 accent-text" /> My notes for this topic</h3>
        <span className="eyebrow">{state === "saving" ? "Saving…" : state === "saved" ? "Saved to database" : "Auto-saves"}</span>
      </div>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Mnemonics, doubts, ward pearls…" className="w-full resize-y rounded-xl border border-line bg-black/30 p-3 text-sm outline-none focus:border-white/30" />
    </div>
  );
}
