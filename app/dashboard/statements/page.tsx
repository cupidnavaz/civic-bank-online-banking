import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function StatementsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/statements" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Official Account Statements</h2>
            <p className="text-xs text-slate-400">SWIFT-Certified PDF & CSV Transaction Records</p>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-medium">
            Archived Records
          </span>
        </header>

        <div className="p-6 max-w-5xl w-full mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
            <h3 className="text-base font-semibold text-slate-200">Generate Statement Period</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Statement Month</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="09-2026">September 2026</option>
                  <option value="08-2026">August 2026</option>
                  <option value="07-2026">July 2026</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Format</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="PDF">Certified PDF Statement</option>
                  <option value="CSV">Spreadsheet CSV Feed</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="button" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors">
                  Download Statement
                </button>
              </div>
            </div>
          </div>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}