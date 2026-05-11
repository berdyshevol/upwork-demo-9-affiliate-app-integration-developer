import { NextResponse } from "next/server";
import { upsertAffiliate } from "@/lib/db";
import { SYNC_FIXTURE } from "@/lib/uppromote";

export const runtime = "nodejs";

/**
 * Stubbed UpPromote sync endpoint.
 *
 * In a real integration this would:
 *   1. Read API credentials from server-only env (UPPROMOTE_API_KEY).
 *   2. Call GET https://aff-api.uppromote.com/api/v1/affiliates with pagination.
 *   3. Map each row through `mapUppromoteRow` (lib/uppromote.ts).
 *   4. Upsert via `upsertAffiliate` and emit a webhook receipt.
 *
 * The fixture lives in lib/uppromote.ts (SYNC_FIXTURE) so the demo path
 * exercises the same upsert code that the live path would.
 */
export async function POST() {
  let created = 0;
  let updated = 0;
  for (const item of SYNC_FIXTURE) {
    const r = upsertAffiliate(item);
    if (r.created) created++;
    else updated++;
  }
  return NextResponse.json({
    created,
    updated,
    total: SYNC_FIXTURE.length,
    syncedAt: new Date().toISOString(),
  });
}
