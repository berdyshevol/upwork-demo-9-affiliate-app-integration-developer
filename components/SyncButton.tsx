"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface SyncResult {
  created: number;
  updated: number;
  total: number;
}

export default function SyncButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSync() {
    setBusy(true);
    setToast(null);
    try {
      const res = await fetch("/api/uppromote/sync", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SyncResult = await res.json();
      setToast({
        kind: "success",
        text: `Synced ${data.total} affiliates from UpPromote stub · ${data.created} created, ${data.updated} updated`,
      });
      startTransition(() => router.refresh());
    } catch (err) {
      setToast({
        kind: "error",
        text: `Sync failed: ${err instanceof Error ? err.message : "unknown"}`,
      });
    } finally {
      setBusy(false);
      setTimeout(() => setToast(null), 6000);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={busy || isPending}
        className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          className={`h-4 w-4 ${busy || isPending ? "animate-spin" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a7 7 0 00-6.708 4.978.75.75 0 11-1.434-.439A8.5 8.5 0 0118.5 10h2L17 13.5 13.5 10h2A7 7 0 0010 3zm0 14a7 7 0 006.708-4.978.75.75 0 111.434.439A8.5 8.5 0 011.5 10h-2L3 6.5 6.5 10h-2A7 7 0 0010 17z"
            clipRule="evenodd"
          />
        </svg>
        {busy ? "Syncing…" : "Sync from UpPromote API"}
      </button>
      {toast && (
        <div
          className={`max-w-sm rounded-md border px-3 py-2 text-xs shadow-sm ${
            toast.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
