import type { Kpis } from "@/lib/types";
import { fmtNum, fmtUsd } from "@/lib/format";

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

export default function KpiTiles({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Tile
        label="Total affiliates"
        value={fmtNum(kpis.totalAffiliates)}
        sub="Across all statuses"
      />
      <Tile
        label="Active referral codes"
        value={fmtNum(kpis.activeReferralCodes)}
        sub="Currently earning commission"
      />
      <Tile
        label="Pending commission"
        value={fmtUsd(kpis.pendingCommission)}
        sub="Owed but not yet paid out"
      />
      <Tile
        label="Paid payouts"
        value={fmtUsd(kpis.paidPayouts)}
        sub="Lifetime, all affiliates"
      />
    </div>
  );
}
