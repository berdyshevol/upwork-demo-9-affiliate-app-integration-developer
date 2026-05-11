import type {
  Affiliate,
  AffiliateRow,
  Kpis,
  Payout,
  Referral,
} from "./types";
import {
  SEED_AFFILIATES,
  SEED_CLICKS,
  SEED_PAYOUTS,
  SEED_REFERRALS,
} from "./seed";

// In-memory store. Vercel cold starts will reseed from the JSON above —
// acceptable per PRD ("data resets on cold start").
interface Store {
  affiliates: Map<string, Affiliate>;
  referrals: Referral[];
  payouts: Payout[];
  clicks: Map<string, number>;
}

declare global {
  var __upPromoteStore__: Store | undefined;
}

function createStore(): Store {
  const affiliates = new Map<string, Affiliate>();
  for (const a of SEED_AFFILIATES) affiliates.set(a.id, a);
  const clicks = new Map<string, number>();
  for (const [id, n] of Object.entries(SEED_CLICKS)) clicks.set(id, n);
  return {
    affiliates,
    referrals: [...SEED_REFERRALS],
    payouts: [...SEED_PAYOUTS],
    clicks,
  };
}

function store(): Store {
  if (!globalThis.__upPromoteStore__) {
    globalThis.__upPromoteStore__ = createStore();
  }
  return globalThis.__upPromoteStore__;
}

export function listAffiliates(): Affiliate[] {
  return Array.from(store().affiliates.values());
}

export function getAffiliate(id: string): Affiliate | undefined {
  return store().affiliates.get(id);
}

export function getAffiliateByCode(code: string): Affiliate | undefined {
  const lc = code.toLowerCase();
  for (const a of store().affiliates.values()) {
    if (a.referralCode.toLowerCase() === lc) return a;
  }
  return undefined;
}

export function getAffiliateByEmail(email: string): Affiliate | undefined {
  const lc = email.toLowerCase();
  for (const a of store().affiliates.values()) {
    if (a.email.toLowerCase() === lc) return a;
  }
  return undefined;
}

export function getReferralsFor(affiliateId: string): Referral[] {
  return store()
    .referrals.filter((r) => r.affiliateId === affiliateId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPayoutsFor(affiliateId: string): Payout[] {
  return store().payouts.filter((p) => p.affiliateId === affiliateId);
}

export function getClicks(affiliateId: string): number {
  return store().clicks.get(affiliateId) ?? 0;
}

export function upsertAffiliate(input: {
  id?: string;
  name: string;
  email: string;
  referralCode: string;
  status: Affiliate["status"];
  joinedAt?: string;
  clicks?: number;
}): { affiliate: Affiliate; created: boolean } {
  const s = store();
  const existing =
    (input.id && s.affiliates.get(input.id)) ||
    getAffiliateByEmail(input.email) ||
    getAffiliateByCode(input.referralCode);

  if (existing) {
    const updated: Affiliate = {
      ...existing,
      name: input.name || existing.name,
      email: input.email || existing.email,
      referralCode: input.referralCode || existing.referralCode,
      status: input.status || existing.status,
      joinedAt: input.joinedAt || existing.joinedAt,
    };
    s.affiliates.set(updated.id, updated);
    if (typeof input.clicks === "number") s.clicks.set(updated.id, input.clicks);
    return { affiliate: updated, created: false };
  }

  const id = input.id || `aff_${(s.affiliates.size + 1).toString().padStart(3, "0")}_${Math.random().toString(36).slice(2, 6)}`;
  const created: Affiliate = {
    id,
    name: input.name,
    email: input.email,
    referralCode: input.referralCode,
    status: input.status,
    joinedAt: input.joinedAt || new Date().toISOString().slice(0, 10),
  };
  s.affiliates.set(id, created);
  if (typeof input.clicks === "number") s.clicks.set(id, input.clicks);
  return { affiliate: created, created: true };
}

export function buildAffiliateRow(a: Affiliate): AffiliateRow {
  const refs = getReferralsFor(a.id);
  const pays = getPayoutsFor(a.id);
  const totalCommission = refs.reduce((s, r) => s + r.commission, 0);
  const paidCommission = pays
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const pendingCommission = pays
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
  const payoutStatus: AffiliateRow["payoutStatus"] =
    pays.some((p) => p.status === "pending") ? "pending" : "paid";
  return {
    ...a,
    clicks: getClicks(a.id),
    orders: refs.length,
    totalCommission,
    pendingCommission,
    paidCommission,
    payoutStatus,
  };
}

export function listAffiliateRows(): AffiliateRow[] {
  return listAffiliates().map(buildAffiliateRow);
}

export function getKpis(): Kpis {
  const s = store();
  const totalAffiliates = s.affiliates.size;
  const activeReferralCodes = Array.from(s.affiliates.values()).filter(
    (a) => a.status === "active",
  ).length;
  const pendingCommission = s.payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const paidPayouts = s.payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  return { totalAffiliates, activeReferralCodes, pendingCommission, paidPayouts };
}

export function addReferral(r: Referral): void {
  store().referrals.push(r);
}

export function addPayout(p: Payout): void {
  store().payouts.push(p);
}
