import { SAMPLE_CSV } from "@/lib/uppromote";

export const runtime = "nodejs";

export async function GET() {
  return new Response(SAMPLE_CSV, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="uppromote-sample.csv"',
    },
  });
}
