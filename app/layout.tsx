import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpPromote Affiliate Dashboard — Demo",
  description:
    "Demo prototype: ingest UpPromote affiliate data into a Next.js dashboard via CSV import or stubbed API sync.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">
                U
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">
                  UpPromote Affiliate Dashboard
                </div>
                <div className="text-xs text-slate-500 leading-none mt-1">
                  Demo prototype · CSV import + API sync
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                className="rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                href="/import"
                className="rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                Import CSV
              </Link>
              <a
                href="https://uppromote.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-md px-3 py-1.5 text-slate-500 hover:bg-slate-100"
              >
                About UpPromote ↗
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        <footer className="border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-500">
          Demo for the UpPromote integration milestone — data resets on cold
          start.
        </footer>
      </body>
    </html>
  );
}
