import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function DepositPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/deposit" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Treasury Deposit & Inbound Funding</h2>
            <p className="text-xs text-slate-400">ABA/SWIFT Wire Instructions & Card Top-up Gateway</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
            Automated Settlement Active
          </span>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">Select Inbound Funding Method</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choose your preferred institutional clearing channel to credit your sub-ledgers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-indigo-500 p-5 rounded-xl cursor-pointer">
                <span className="text-xs font-mono text-indigo-400 block font-bold">WIRE / ABA</span>
                <div className="text-sm font-semibold text-white mt-2">Direct Bank Wire</div>
                <p className="text-[11px] text-slate-400 mt-1">Same-day Fedwire or SWIFT transfer.</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs font-mono text-slate-400 block font-bold">DEBIT CARD</span>
                <div className="text-sm font-semibold text-white mt-2">Instant Card Top-up</div>
                <p className="text-[11px] text-slate-400 mt-1">Fund instantly using corporate card.</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs font-mono text-slate-400 block font-bold">STABLECOIN</span>
                <div className="text-sm font-semibold text-white mt-2">USDC / USDT Gateway</div>
                <p className="text-[11px] text-slate-400 mt-1">1:1 automated USD treasury minting.</p>
              </div>
            </div>

            {/* Account Routing Display */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4 font-mono text-xs">
              <div className="text-slate-400 uppercase tracking-wider text-[10px]">Your Dedicated Inbound Routing Instructions</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block">Beneficiary Bank:</span>
                  <span className="text-slate-200 font-semibold text-sm">Civic Prime Global Bank N.A.</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ABA Routing Number:</span>
                  <span className="text-indigo-400 font-semibold text-sm">122087654</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Number:</span>
                  <span className="text-slate-200 font-semibold text-sm">CB-4977056094</span>
                </div>
                <div>
                  <span className="text-slate-500 block">SWIFT / BIC:</span>
                  <span className="text-indigo-400 font-semibold text-sm">CPGBUS33XXX</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/25">
                Generate Official Deposit Notice
              </button>
            </div>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}