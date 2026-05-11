import type { AffiliateStatus, PayoutStatus } from "@/lib/types";

const AFFILIATE_STYLES: Record<AffiliateStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  disabled: "bg-slate-100 text-slate-600 ring-slate-200",
};

const PAYOUT_STYLES: Record<PayoutStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function AffiliateStatusBadge({ status }: { status: AffiliateStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${AFFILIATE_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PAYOUT_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
