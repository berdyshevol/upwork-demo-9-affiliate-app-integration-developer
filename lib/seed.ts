import type { Affiliate, Payout, Referral } from "./types";

export const SEED_AFFILIATES: Affiliate[] = [
  { id: "aff_001", name: "Maya Chen",        email: "maya@craftloop.co",      referralCode: "MAYA10",      status: "active",  joinedAt: "2025-09-12" },
  { id: "aff_002", name: "Jordan Park",      email: "jordan@theovenfeed.com", referralCode: "JORDAN15",    status: "active",  joinedAt: "2025-10-02" },
  { id: "aff_003", name: "Priya Iyer",       email: "priya@plantpostal.io",   referralCode: "PRIYA",       status: "active",  joinedAt: "2025-08-30" },
  { id: "aff_004", name: "Diego Alvarez",    email: "diego@runclubmty.com",   referralCode: "DIEGO20",     status: "active",  joinedAt: "2025-11-18" },
  { id: "aff_005", name: "Hannah Olsen",     email: "hannah@nordicwool.no",   referralCode: "NORDIC",      status: "active",  joinedAt: "2026-01-05" },
  { id: "aff_006", name: "Tariq Brooks",     email: "tariq@eastsidegoods.com",referralCode: "TARIQB",      status: "pending", joinedAt: "2026-02-20" },
  { id: "aff_007", name: "Sophie Laurent",   email: "sophie@laruelle.fr",     referralCode: "SOPHIE12",    status: "active",  joinedAt: "2025-07-04" },
  { id: "aff_008", name: "Ben Whitaker",     email: "ben@gearworks.dev",      referralCode: "GEAR10",      status: "active",  joinedAt: "2025-12-11" },
  { id: "aff_009", name: "Yui Tanaka",       email: "yui@kominkacrafts.jp",   referralCode: "KOMINKA",     status: "disabled",joinedAt: "2025-06-01" },
  { id: "aff_010", name: "Marcus Reilly",    email: "marcus@trailbento.com",  referralCode: "TRAIL5",      status: "active",  joinedAt: "2026-03-22" },
  { id: "aff_011", name: "Amaka Obi",        email: "amaka@lagosthread.co",   referralCode: "LAGOS",       status: "active",  joinedAt: "2025-10-19" },
  { id: "aff_012", name: "Felix Schwartz",   email: "felix@bauhausbeans.de",  referralCode: "BAUHAUS",     status: "active",  joinedAt: "2026-04-02" },
];

const orderId = (n: number) => `ord_${String(n).padStart(5, "0")}`;

export const SEED_REFERRALS: Referral[] = [
  { id: "ref_0001", affiliateId: "aff_001", orderId: orderId(10001), orderTotal: 142.50, commission: 14.25, createdAt: "2026-04-10" },
  { id: "ref_0002", affiliateId: "aff_001", orderId: orderId(10002), orderTotal:  89.00, commission:  8.90, createdAt: "2026-04-22" },
  { id: "ref_0003", affiliateId: "aff_001", orderId: orderId(10003), orderTotal: 210.10, commission: 21.01, createdAt: "2026-05-01" },
  { id: "ref_0004", affiliateId: "aff_002", orderId: orderId(10004), orderTotal: 320.00, commission: 48.00, createdAt: "2026-04-14" },
  { id: "ref_0005", affiliateId: "aff_002", orderId: orderId(10005), orderTotal: 180.40, commission: 27.06, createdAt: "2026-04-28" },
  { id: "ref_0006", affiliateId: "aff_003", orderId: orderId(10006), orderTotal:  64.00, commission:  6.40, createdAt: "2026-03-30" },
  { id: "ref_0007", affiliateId: "aff_003", orderId: orderId(10007), orderTotal: 128.00, commission: 12.80, createdAt: "2026-04-15" },
  { id: "ref_0008", affiliateId: "aff_004", orderId: orderId(10008), orderTotal: 540.00, commission:108.00, createdAt: "2026-04-19" },
  { id: "ref_0009", affiliateId: "aff_005", orderId: orderId(10009), orderTotal: 720.00, commission: 72.00, createdAt: "2026-04-08" },
  { id: "ref_0010", affiliateId: "aff_005", orderId: orderId(10010), orderTotal: 110.00, commission: 11.00, createdAt: "2026-05-04" },
  { id: "ref_0011", affiliateId: "aff_007", orderId: orderId(10011), orderTotal: 250.00, commission: 30.00, createdAt: "2026-04-25" },
  { id: "ref_0012", affiliateId: "aff_007", orderId: orderId(10012), orderTotal: 410.00, commission: 49.20, createdAt: "2026-05-02" },
  { id: "ref_0013", affiliateId: "aff_008", orderId: orderId(10013), orderTotal:  78.00, commission:  7.80, createdAt: "2026-04-29" },
  { id: "ref_0014", affiliateId: "aff_010", orderId: orderId(10014), orderTotal:  45.00, commission:  2.25, createdAt: "2026-05-03" },
  { id: "ref_0015", affiliateId: "aff_011", orderId: orderId(10015), orderTotal: 134.00, commission: 13.40, createdAt: "2026-04-26" },
  { id: "ref_0016", affiliateId: "aff_011", orderId: orderId(10016), orderTotal: 198.00, commission: 19.80, createdAt: "2026-05-05" },
  { id: "ref_0017", affiliateId: "aff_012", orderId: orderId(10017), orderTotal: 410.00, commission: 41.00, createdAt: "2026-05-07" },
];

export const SEED_PAYOUTS: Payout[] = [
  { id: "pay_001", affiliateId: "aff_001", amount: 23.15, status: "paid",    paidAt: "2026-04-25" },
  { id: "pay_002", affiliateId: "aff_001", amount: 21.01, status: "pending" },
  { id: "pay_003", affiliateId: "aff_002", amount: 75.06, status: "pending" },
  { id: "pay_004", affiliateId: "aff_003", amount: 19.20, status: "paid",    paidAt: "2026-04-20" },
  { id: "pay_005", affiliateId: "aff_004", amount:108.00, status: "pending" },
  { id: "pay_006", affiliateId: "aff_005", amount: 83.00, status: "pending" },
  { id: "pay_007", affiliateId: "aff_007", amount: 79.20, status: "pending" },
  { id: "pay_008", affiliateId: "aff_008", amount:  7.80, status: "paid",    paidAt: "2026-05-01" },
  { id: "pay_009", affiliateId: "aff_010", amount:  2.25, status: "pending" },
  { id: "pay_010", affiliateId: "aff_011", amount: 33.20, status: "pending" },
  { id: "pay_011", affiliateId: "aff_012", amount: 41.00, status: "pending" },
];

// Synthetic click counts (UpPromote tracks clicks per affiliate)
export const SEED_CLICKS: Record<string, number> = {
  aff_001: 412,
  aff_002: 287,
  aff_003: 134,
  aff_004: 905,
  aff_005: 1243,
  aff_006:  18,
  aff_007: 521,
  aff_008:  88,
  aff_009:   2,
  aff_010:  47,
  aff_011: 333,
  aff_012: 612,
};
