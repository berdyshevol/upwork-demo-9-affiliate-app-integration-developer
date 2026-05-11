"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AffiliateRow } from "@/lib/types";
import { fmtNum, fmtUsd } from "@/lib/format";
import { AffiliateStatusBadge, PayoutStatusBadge } from "./StatusBadge";

type SortKey =
  | "name"
  | "email"
  | "referralCode"
  | "clicks"
  | "orders"
  | "totalCommission"
  | "payoutStatus";

type SortDir = "asc" | "desc";

export default function AffiliatesTable({ rows }: { rows: AffiliateRow[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalCommission");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? rows.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.referralCode.toLowerCase().includes(q),
        )
      : rows;
    const sorted = [...base].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [rows, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "email" || key === "referralCode" ? "asc" : "desc");
    }
  }

  function arrow(key: SortKey) {
    if (key !== sortKey) return <span className="text-slate-300">↕</span>;
    return <span className="text-slate-700">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
        <div>
          <h2 className="text-base font-semibold">Affiliates</h2>
          <p className="text-xs text-slate-500">
            Showing {fmtNum(filtered.length)} of {fmtNum(rows.length)}
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or code"
          className="w-72 rounded-md border border-slate-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <Th onClick={() => toggleSort("name")}>Name {arrow("name")}</Th>
              <Th onClick={() => toggleSort("email")}>Email {arrow("email")}</Th>
              <Th onClick={() => toggleSort("referralCode")}>Code {arrow("referralCode")}</Th>
              <Th align="right" onClick={() => toggleSort("clicks")}>Clicks {arrow("clicks")}</Th>
              <Th align="right" onClick={() => toggleSort("orders")}>Orders {arrow("orders")}</Th>
              <Th align="right" onClick={() => toggleSort("totalCommission")}>Commission {arrow("totalCommission")}</Th>
              <Th onClick={() => toggleSort("payoutStatus")}>Payout {arrow("payoutStatus")}</Th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-2.5">
                  <Link
                    href={`/affiliates/${r.id}`}
                    className="font-medium text-slate-900 hover:text-brand-700"
                  >
                    {r.name}
                  </Link>
                  <div className="mt-0.5">
                    <AffiliateStatusBadge status={r.status} />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{r.email}</td>
                <td className="px-4 py-2.5">
                  <span className="kbd">{r.referralCode}</span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">{fmtNum(r.clicks)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{fmtNum(r.orders)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {fmtUsd(r.totalCommission)}
                </td>
                <td className="px-4 py-2.5">
                  <PayoutStatusBadge status={r.payoutStatus} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/affiliates/${r.id}`}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                  No affiliates match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  align = "left",
  onClick,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  onClick?: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className={`select-none px-4 py-2.5 ${align === "right" ? "text-right" : "text-left"} ${onClick ? "cursor-pointer hover:text-slate-800" : ""}`}
    >
      {children}
    </th>
  );
}
