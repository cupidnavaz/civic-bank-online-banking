import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function SavingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const savingsVaults = [
    { name: "Fixed-Term Corporate Reserve (90 Days)", rate: "5.50% APY", balance: "$50,000.00", maturity: "Dec 15, 2026", status: "LOCKED" },
    { name: "High-Yield Liquid Savings Pool", rate: "4.85% APY", balance: "$15,400.00", maturity: "Flexible", status: "ACTIVE" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/savings" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Institutional Savings & Term Vaults</h2>
            <p className="text-xs text-slate-400">Automated Compound Growth & Fixed-Term Allocation</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/20">
            + Create Savings Vault
          </button>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Savings Balance</span>
              <div className="text-3xl font-bold text-white mt-2 font-mono">$65,400.00</div>
              <p className="text-xs text-emerald-400 mt-2">+$312.40 accrued interest this month</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Interest Rate</span>
              <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">5.25% APY</div>
              <p className="text-xs text-slate-400 mt-2">Paid directly daily</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Auto-Save Rule</span>
              <div className="text-3xl font-bold text-indigo-400 mt-2 font-mono">10% Sweep</div>
              <p className="text-xs text-slate-400 mt-2">Swept on incoming wire credits</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-200">Active Term & Savings Portfolios</h3>
              <p className="text-xs text-slate-400 mt-0.5">Segregated vault reserves earning institutional-grade interest.</p>
            </div>
            <div className="divide-y divide-slate-800">
              {savingsVaults.map((vault, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-800/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-semibold text-white">{vault.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${vault.status === "LOCKED" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                        {vault.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-400 mt-1">
                      <span>Balance: <strong className="text-slate-200">{vault.balance}</strong></span>
                      <span>Maturity: <strong className="text-slate-200">{vault.maturity}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase block">Interest Rate</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{vault.rate}</span>
                    </div>
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors">
                      Manage Vault
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}