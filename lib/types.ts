export type AffiliateStatus = "active" | "pending" | "disabled";
export type PayoutStatus = "pending" | "paid";

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  status: AffiliateStatus;
  joinedAt: string;
}

export interface Referral {
  id: string;
  affiliateId: string;
  orderId: string;
  orderTotal: number;
  commission: number;
  createdAt: string;
}

export interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  status: PayoutStatus;
  paidAt?: string;
}

export interface AffiliateRow extends Affiliate {
  clicks: number;
  orders: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  payoutStatus: PayoutStatus;
}

export interface Kpis {
  totalAffiliates: number;
  activeReferralCodes: number;
  pendingCommission: number;
  paidPayouts: number;
}
