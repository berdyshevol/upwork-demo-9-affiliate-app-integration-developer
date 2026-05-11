# UpPromote Affiliate Dashboard — Demo

A focused Next.js (App Router) prototype that demonstrates the first milestone
of an UpPromote integration: ingesting affiliate data into a clean dashboard
through **two paths** — CSV import and a stubbed API sync.

> Built for the affiliate-app integration scope. Auth, payouts, Shopify, and
> webhooks are intentionally out of scope.

## What this demonstrates

- **Dashboard with KPI tiles** — Total affiliates, active referral codes,
  pending commission, paid payouts.
- **Affiliates table** — Search by name / email / code, sort by every column,
  payout status badge per row.
- **Affiliate detail page** (`/affiliates/[id]`) — Referral history table and
  payout breakdown.
- **CSV import** (`/import`) — Drag in an UpPromote-style export, see a
  preview, validate, and commit. Validation errors are reported per row.
- **Stubbed sync** (`/api/uppromote/sync`) — Mimics the real UpPromote API
  shape. Wire up real credentials by swapping the fixture in
  `lib/uppromote.ts`.
- **Field mapping** — Documented below and rendered live on the import page.

## Run locally

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Production check:

```bash
pnpm build && pnpm start
```

## Deploy

This app deploys cleanly to Vercel — no env vars required, no native
dependencies. State is held in-memory and reseeded from JSON fixtures on cold
start, which is the right tradeoff for a demo.

**Live URL:** _to be added after deploy_

## UpPromote → app field mapping

The mapping lives in [`lib/uppromote.ts`](./lib/uppromote.ts) (`UPPROMOTE_FIELD_MAP`).
It is also rendered on the `/import` page so anyone reviewing the demo can see
the contract at a glance.

| UpPromote CSV column | App field             | Notes                                                         |
| -------------------- | --------------------- | ------------------------------------------------------------- |
| `Affiliate ID`       | `affiliate.id`        | Optional. Used to dedupe; falls back to email or code.        |
| `Name`               | `affiliate.name`      | Required.                                                     |
| `Email`              | `affiliate.email`     | Required. Used as fallback dedupe key.                        |
| `Referral Code`      | `affiliate.referralCode` | Required. Also used as a dedupe key.                       |
| `Status`             | `affiliate.status`    | `Approved` → `active`, `Pending` → `pending`, `Disabled` → `disabled`. |
| `Joined At`          | `affiliate.joinedAt`  | ISO date or `YYYY-MM-DD`.                                     |
| `Total Clicks`       | `affiliate.clicks`    | Numeric.                                                      |

Validation is enforced with Zod in `uppromoteRowSchema`. Rows that fail are
reported back to the importer with the row number and a human-readable reason.

## Swapping the stub for the real API

`/api/uppromote/sync` currently iterates `SYNC_FIXTURE` from
`lib/uppromote.ts`. To wire it up to live UpPromote data:

1. Add `UPPROMOTE_API_KEY` to your environment (Vercel project settings).
2. In `app/api/uppromote/sync/route.ts`, replace the fixture loop with a paged
   `fetch` against `https://aff-api.uppromote.com/api/v1/affiliates`.
3. Run each row through the existing `mapUppromoteRow()` function — the rest
   of the pipeline (`upsertAffiliate`) stays identical.

The CSV import path goes through the same `mapUppromoteRow` →
`upsertAffiliate` pipeline, which keeps the two ingest paths in sync.

## Project layout

```
app/
  page.tsx                       # Dashboard (KPIs + table)
  import/page.tsx                # CSV import UI + field-map doc
  affiliates/[id]/page.tsx       # Detail view
  api/affiliates/route.ts        # GET / POST affiliate
  api/import/route.ts            # POST CSV body, returns counts + errors
  api/uppromote/sync/route.ts    # POST stub, returns counts
  api/uppromote/sample/route.ts  # GET sample CSV
components/
  AffiliatesTable.tsx            # Search + sort, client component
  CsvImport.tsx                  # Upload + preview + commit
  KpiTiles.tsx                   # KPI grid
  StatusBadge.tsx                # Affiliate + payout status badges
  SyncButton.tsx                 # Calls /api/uppromote/sync, refreshes router
lib/
  db.ts                          # In-memory store, KPIs, upsert
  uppromote.ts                   # Field map, CSV parser, Zod schema, fixture
  seed.ts                        # 12 sample affiliates + referrals + payouts
  format.ts                      # Number/date formatters
  types.ts                       # Domain types
```

## Acceptance criteria

- [x] Dashboard loads with seeded KPIs and 12 sample affiliates.
- [x] CSV upload validates and persists, then refreshes the dashboard.
- [x] Sync button appends fixture rows and shows a toast with counts.
- [x] Affiliate detail shows referrals + payout status from the data model.
- [x] README documents the UpPromote → app field mapping and the stub-swap path.
