import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function WithdrawPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let accounts: any[] = [];
  try {
    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { accounts: true },
    });
    if (dbUser) accounts = dbUser.accounts || [];
  } catch (err) {
    console.error("Withdraw fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/withdrawals" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Liquidity Withdrawal & Clearing</h2>
            <p className="text-xs text-slate-400">External Bank Off-Ramping & Multi-Sig Authorization</p>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-mono">
            Secure 2FA Protected
          </span>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="bg-slate-900/90 border border-slate-800/80 p-8 rounded-2xl shadow-2xl space-y-6 backdrop-blur-sm">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Withdraw Funds to External Account</h3>
                <p className="text-xs text-slate-400 mt-0.5">Transfer cleared capital from your vault to verified external bank accounts.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                Available: $150,000.00
              </span>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Source Clearing Vault</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
                    {accounts.length > 0 ? (
                      accounts.map((acc: any) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.currency} Vault — Balance: ${Number(acc.balance || 0).toLocaleString()}
                        </option>
                      ))
                    ) : (
                      <option value="usd">USD Primary Vault ($150,000.00)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Destination Bank Account / IBAN</label>
                  <input type="text" placeholder="Enter verified IBAN or account number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Withdrawal Amount ($ USD)</label>
                <input type="number" placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Network Fee: <span className="text-white font-semibold">$15.00 SWIFT Flat</span>
                </div>
                <button type="button" className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20">
                  Confirm & Request Withdrawal
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