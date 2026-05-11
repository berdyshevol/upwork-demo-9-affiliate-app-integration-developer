"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface ImportResult {
  created: number;
  updated: number;
  total: number;
  errors: { row: number; reason: string }[];
}

export default function CsvImport() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [csvText, setCsvText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    const text = await file.text();
    setCsvText(text);
  }

  async function handleSubmit() {
    if (!csvText.trim()) {
      setError("Paste CSV content or choose a file first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: csvText,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Import failed (${res.status})`);
        return;
      }
      setResult(data);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  function handleClear() {
    setCsvText("");
    setResult(null);
    setError(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  const previewRows = csvText
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "")
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Upload CSV</h2>
          <p className="text-xs text-slate-500">
            Drop in an UpPromote affiliates export, or use the sample file to
            see the flow end-to-end.
          </p>
        </div>
        <a
          href="/api/uppromote/sample"
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Download sample CSV ↓
        </a>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          className="block text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-brand-700"
        />
        <button
          onClick={handleSubmit}
          disabled={busy || !csvText.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Importing…" : "Validate & import"}
        </button>
        <button
          onClick={handleClear}
          disabled={busy || !csvText}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      {previewRows.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Preview ({csvText.split(/\r?\n/).filter((l) => l.trim() !== "").length - 1} data rows)
          </div>
          <pre className="mt-1 max-h-48 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
{previewRows.join("\n")}
{csvText.split(/\r?\n/).filter((l) => l.trim() !== "").length > 6 ? "\n…" : ""}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Imported {result.total} rows · {result.created} created ·{" "}
            {result.updated} updated
            {result.errors.length > 0 && ` · ${result.errors.length} skipped`}
          </div>
          {result.errors.length > 0 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <div className="mb-1 font-semibold">Skipped rows</div>
              <ul className="space-y-0.5">
                {result.errors.map((e) => (
                  <li key={e.row}>
                    Row {e.row}: {e.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
