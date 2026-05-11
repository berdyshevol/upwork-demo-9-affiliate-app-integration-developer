import CsvImport from "@/components/CsvImport";
import { UPPROMOTE_FIELD_MAP } from "@/lib/uppromote";

export const dynamic = "force-static";

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import affiliates from CSV</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload an UpPromote-style affiliates export. Rows are validated against
          the UpPromote schema, mapped to the app's data model, and upserted by
          email or referral code.
        </p>
      </div>

      <CsvImport />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold">UpPromote → app field mapping</h2>
        <p className="mt-1 text-xs text-slate-500">
          Defined in <code className="kbd">lib/uppromote.ts</code>.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">UpPromote CSV column</th>
                <th className="px-3 py-2 text-left">App field</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(UPPROMOTE_FIELD_MAP).map(([from, to]) => (
                <tr key={from} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">{from}</td>
                  <td className="px-3 py-2 text-slate-600">
                    <span className="kbd">{to}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
