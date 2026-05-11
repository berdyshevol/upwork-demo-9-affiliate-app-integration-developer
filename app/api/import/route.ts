import { NextResponse } from "next/server";
import { upsertAffiliate } from "@/lib/db";
import {
  mapUppromoteRow,
  parseCsv,
  uppromoteRowSchema,
} from "@/lib/uppromote";

export const runtime = "nodejs";

interface ImportError {
  row: number;
  reason: string;
}

export async function POST(req: Request) {
  let csv: string;
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      csv = String(body.csv ?? "");
    } else {
      csv = await req.text();
    }
  } catch {
    return NextResponse.json({ error: "Could not read request body" }, { status: 400 });
  }

  if (!csv.trim()) {
    return NextResponse.json({ error: "CSV is empty" }, { status: 400 });
  }

  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows found in CSV" }, { status: 400 });
  }

  let created = 0;
  let updated = 0;
  const errors: ImportError[] = [];

  rows.forEach((raw, idx) => {
    const parsed = uppromoteRowSchema.safeParse(raw);
    if (!parsed.success) {
      errors.push({
        row: idx + 2, // header is row 1
        reason: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      });
      return;
    }
    const mapped = mapUppromoteRow(parsed.data);
    const result = upsertAffiliate(mapped);
    if (result.created) created++;
    else updated++;
  });

  return NextResponse.json({
    created,
    updated,
    total: rows.length,
    errors,
  });
}
