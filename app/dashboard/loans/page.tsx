import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function LoansPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/loans" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Commercial Credit & Loan Facilities</h2>
            <p className="text-xs text-slate-400">Collateralized Working Capital Lines & Asset Financing</p>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
            Line Limit: $1,000,000.00
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Credit Drawn</span>
              <div className="text-3xl font-bold text-white mt-2 font-mono">$0.00</div>
              <p className="text-xs text-emerald-400 mt-2">Zero outstanding principal balances</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Available Credit Line</span>
              <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">$1,000,000.00</div>
              <p className="text-xs text-slate-400 mt-2">Prime rate + 1.25% floating</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Facility Status</span>
              <div className="text-3xl font-bold text-indigo-400 mt-2 font-mono">Pre-Approved</div>
              <p className="text-xs text-slate-400 mt-2">Instant disbursement enabled</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">Request Credit Line Drawdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Instantly draw working capital against your institutional collateral or Treasury holdings.</p>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Credit Facility Type</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
                    <option>Revolving Working Capital Line ($1,000,000 max)</option>
                    <option>Asset-Backed Term Loan (Treasury Collateral)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Drawdown Amount ($ USD)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Disbursement Account</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
                  <option>USD Primary Vault — CB-4977056094 ($1,000.00)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Interest Accrual: <span className="text-white font-semibold">Daily Calculation / Monthly Invoicing</span>
                </div>
                <button type="button" className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20">
                  Submit Drawdown Request
                </button>
              </div>
            </form>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}