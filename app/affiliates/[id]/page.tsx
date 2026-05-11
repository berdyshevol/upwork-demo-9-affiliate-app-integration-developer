import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildAffiliateRow,
  getAffiliate,
  getPayoutsFor,
  getReferralsFor,
} from "@/lib/db";
import { fmtDate, fmtNum, fmtUsd } from "@/lib/format";
import {
  AffiliateStatusBadge,
  PayoutStatusBadge,
} from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const affiliate = getAffiliate(id);
  if (!affiliate) notFound();
  const row = buildAffiliateRow(affiliate);
  const referrals = getReferralsFor(id);
  const payouts = getPayoutsFor(id);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{affiliate.name}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
              <span>{affiliate.email}</span>
              <span className="text-slate-300">·</span>
              <span>
                Code <span className="kbd">{affiliate.referralCode}</span>
              </span>
              <span className="text-slate-300">·</span>
              <AffiliateStatusBadge status={affiliate.status} />
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            Joined {fmtDate(affiliate.joinedAt)}
            <div className="mt-0.5">ID {affiliate.id}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Clicks" value={fmtNum(row.clicks)} />
        <Stat label="Orders" value={fmtNum(row.orders)} />
        <Stat label="Total commission" value={fmtUsd(row.totalCommission)} />
        <Stat label="Pending payout" value={fmtUsd(row.pendingCommission)} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-base font-semibold">Referral history</h2>
          <p className="text-xs text-slate-500">
            Orders attributed to this affiliate's referral code.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 text-left">Order</th>
                <th className="px-4 py-2.5 text-left">Date</th>
                <th className="px-4 py-2.5 text-right">Order total</th>
                <th className="px-4 py-2.5 text-right">Commission</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5">
                    <span className="kbd">{r.orderId}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmtUsd(r.orderTotal)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                    {fmtUsd(r.commission)}
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    No referrals yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-base font-semibold">Payouts</h2>
          <p className="text-xs text-slate-500">
            Commission disbursements for this affiliate.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 text-left">Payout</th>
                <th className="px-4 py-2.5 text-right">Amount</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5 text-left">Paid at</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5">
                    <span className="kbd">{p.id}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {fmtUsd(p.amount)}
                  </td>
                  <td className="px-4 py-2.5">
                    <PayoutStatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {p.paidAt ? fmtDate(p.paidAt) : "—"}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    No payouts on record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </div>
    </div>
  );
}
