import { z } from "zod";
import type { Affiliate, AffiliateStatus } from "./types";

/**
 * UpPromote → app field mapping.
 * Source: UpPromote "Export Affiliates" CSV columns (as of 2025).
 * The keys here are CSV column names; the values describe how we map them.
 */
export const UPPROMOTE_FIELD_MAP = {
  "Affiliate ID":     "affiliate.id",
  "Name":             "affiliate.name",
  "Email":            "affiliate.email",
  "Referral Code":    "affiliate.referralCode",
  "Status":           "affiliate.status",        // "Approved" | "Pending" | "Disabled"
  "Joined At":        "affiliate.joinedAt",      // ISO date or YYYY-MM-DD
  "Total Clicks":     "affiliate.clicks",        // numeric
} as const;

const STATUS_NORMALIZE: Record<string, AffiliateStatus> = {
  approved: "active",
  active: "active",
  pending: "pending",
  unapproved: "pending",
  disabled: "disabled",
  banned: "disabled",
  rejected: "disabled",
};

export const uppromoteRowSchema = z.object({
  "Affiliate ID": z.string().optional(),
  "Name": z.string().min(1, "Name is required"),
  "Email": z.string().email("Invalid email"),
  "Referral Code": z.string().min(1, "Referral Code is required"),
  "Status": z.string().optional(),
  "Joined At": z.string().optional(),
  "Total Clicks": z.string().optional(),
});

export type UppromoteRow = z.infer<typeof uppromoteRowSchema>;

export interface MappedAffiliate {
  id?: string;
  name: string;
  email: string;
  referralCode: string;
  status: AffiliateStatus;
  joinedAt?: string;
  clicks?: number;
}

export function mapUppromoteRow(row: UppromoteRow): MappedAffiliate {
  const rawStatus = (row["Status"] || "approved").trim().toLowerCase();
  const status: AffiliateStatus = STATUS_NORMALIZE[rawStatus] ?? "pending";
  const clicks = row["Total Clicks"] ? Number(row["Total Clicks"]) : undefined;
  return {
    id: row["Affiliate ID"]?.trim() || undefined,
    name: row["Name"].trim(),
    email: row["Email"].trim(),
    referralCode: row["Referral Code"].trim(),
    status,
    joinedAt: row["Joined At"]?.trim() || undefined,
    clicks: typeof clicks === "number" && !Number.isNaN(clicks) ? clicks : undefined,
  };
}

/**
 * Tiny CSV parser sufficient for UpPromote-style exports (commas + optional
 * double-quote escaping). For real production use we'd swap for `papaparse`.
 */
export function parseCsv(input: string): Record<string, string>[] {
  const text = input.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      cur.push(field);
      field = "";
    } else if (c === "\n") {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }

  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      header.forEach((h, idx) => {
        obj[h] = (r[idx] ?? "").trim();
      });
      return obj;
    });
}

/**
 * Sample CSV that matches the field map above. Surfaced via /api/uppromote/sample
 * so users can download a working example for the import demo.
 */
export const SAMPLE_CSV = `Affiliate ID,Name,Email,Referral Code,Status,Joined At,Total Clicks
,Renee Voss,renee@vossatelier.com,RENEE10,Approved,2026-04-30,182
,Karim Haddad,karim@blueoudsoap.co,KARIM,Approved,2026-05-02,64
,Lin Wei,lin@porcelaindock.cn,LINWEI,Pending,2026-05-04,12
,Esme O'Brien,esme@harborknits.ie,HARBOR15,Approved,2026-05-05,308
,Theo Ackerman,theo@redrockcoffee.us,REDROCK,Disabled,2025-12-09,3
`;

/** Used by /api/uppromote/sync to simulate a vendor-side payload. */
export const SYNC_FIXTURE: MappedAffiliate[] = [
  { name: "Aisha Bello",   email: "aisha@kanostudios.ng", referralCode: "AISHA20", status: "active",  joinedAt: "2026-05-06", clicks: 221 },
  { name: "Niko Petrov",   email: "niko@balticbrew.lv",   referralCode: "BALTIC",  status: "active",  joinedAt: "2026-05-07", clicks: 87 },
  { name: "Sara Lindqvist", email: "sara@nordfika.se",     referralCode: "NORDFIKA",status: "pending", joinedAt: "2026-05-08", clicks: 9 },
];
