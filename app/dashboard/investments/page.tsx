import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function InvestmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const investmentPools = [
    { name: "Institutional US Treasuries Prime Fund", apy: "5.24%", tvl: "$420,500,000", risk: "Low (AAA)", term: "Daily Liquidity" },
    { name: "European Sovereign Commercial Paper", apy: "4.85%", tvl: "$185,200,000", risk: "Low (AA+)", term: "30-Day Lock" },
    { name: "Global Liquidity Yield Vault", apy: "6.10%", tvl: "$94,000,000", risk: "Moderate", term: "Instant Settlement" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/investments" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Treasury & Yield Management</h2>
            <p className="text-xs text-slate-400">Automated Cash Sweep & Money Market Funds</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
            Active Yield: 5.42% Avg
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Deployed Capital</span>
              <div className="text-3xl font-bold text-white mt-2 font-mono">$150,000.00</div>
              <p className="text-xs text-emerald-400 mt-2">+$642.10 earned this month</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weighted Average APY</span>
              <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">5.32%</div>
              <p className="text-xs text-slate-400 mt-2">Compounded daily</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Auto-Sweep Status</span>
              <div className="text-3xl font-bold text-indigo-400 mt-2 font-mono">Enabled</div>
              <p className="text-xs text-slate-400 mt-2">Excess balance sweeps into Treasury</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-200">Institutional Yield Pools</h3>
              <p className="text-xs text-slate-400 mt-0.5">Allocate idle treasury reserves into regulated short-duration instruments.</p>
            </div>
            <div className="divide-y divide-slate-800">
              {investmentPools.map((pool, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-800/30 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{pool.name}</h4>
                    <div className="flex gap-4 text-xs text-slate-400 mt-1">
                      <span>TVL: <strong className="text-slate-200">{pool.tvl}</strong></span>
                      <span>Risk: <strong className="text-emerald-400">{pool.risk}</strong></span>
                      <span>Term: <strong className="text-slate-200">{pool.term}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase block">Projected APY</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{pool.apy}</span>
                    </div>
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors">
                      Allocate Funds
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