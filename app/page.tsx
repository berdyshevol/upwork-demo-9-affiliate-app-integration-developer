import Link from "next/link";
import KpiTiles from "@/components/KpiTiles";
import AffiliatesTable from "@/components/AffiliatesTable";
import SyncButton from "@/components/SyncButton";
import { getKpis, listAffiliateRows } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const kpis = getKpis();
  const rows = listAffiliateRows();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Affiliate dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Live view of affiliates ingested from UpPromote — via CSV import or a
            stubbed API sync. Click any row for referral history and payout breakdown.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/import"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Import CSV
          </Link>
          <SyncButton />
        </div>
      </div>

      <KpiTiles kpis={kpis} />

      <AffiliatesTable rows={rows} />
    </div>
  );
}
