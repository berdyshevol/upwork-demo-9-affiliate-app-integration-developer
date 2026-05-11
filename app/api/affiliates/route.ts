import { NextResponse } from "next/server";
import { getKpis, listAffiliateRows, upsertAffiliate } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    kpis: getKpis(),
    rows: listAffiliateRows(),
  });
}

const postSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  referralCode: z.string().min(1),
  status: z.enum(["active", "pending", "disabled"]).default("pending"),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { affiliate, created } = upsertAffiliate(parsed.data);
  return NextResponse.json({ affiliate, created }, { status: created ? 201 : 200 });
}
