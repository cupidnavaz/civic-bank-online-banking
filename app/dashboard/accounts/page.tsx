import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import FxConversionForm from "@/components/FxConversionForm";
import AccountOpeningForm from "@/components/AccountOpeningForm";
import ReceiveFundsPanel from "@/components/ReceiveFundsPanel";

export default async function AccountsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let dbUser: any = null;
  let accounts: any[] = [];

  try {
    dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { accounts: true },
    });

    if (dbUser) {
      accounts = dbUser.accounts || [];
    }
  } catch (err) {
    console.error("Accounts database error:", err);
  }

  // Calculate total composite liquidity in USD
  const totalLiquidityUSD = accounts.reduce((acc, curr) => {
    const rate = curr.currency === "EUR" ? 1.09 : curr.currency === "GBP" ? 1.27 : 1.0;
    return acc + (Number(curr.balance || 0) * rate);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/accounts" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Multicurrency Vault Accounts</h2>
            <p className="text-xs text-slate-400">Institutional Sub-Ledgers & Real-Time FX Exchange</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
            SWIFT Clearing Route Active
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Liquidity Header Summary */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Consolidated Portfolio</span>
              <div className="text-3xl font-bold text-white mt-1 font-mono">
                ${totalLiquidityUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/transfers" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors">
                New Wire Transfer
              </Link>
            </div>
          </div>

          <AccountOpeningForm />

          <ReceiveFundsPanel accounts={accounts} />

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accounts.length > 0 ? (
              accounts.map((acc: any) => (
                <div key={acc.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">{acc.currency || "USD"} Vault</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">{acc.accountNumber ? `•••• ${String(acc.accountNumber).slice(-4)}` : "PRIMARY"}</span>
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">
                      {acc.currency === "EUR" ? "€" : acc.currency === "GBP" ? "£" : "$"}
                      {Number(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">IBAN / BIC Settlement Ready</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-mono">● {acc.status || "ACTIVE"}</span>
                    <span className="text-slate-400">{acc.type || "Checking"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-slate-900 border border-slate-800 p-12 text-center rounded-xl">
                <p className="text-sm text-slate-400">No multi-currency sub-ledgers provisioned yet.</p>
                <p className="text-xs text-slate-500 mt-1">Default USD clearing account is active on your master profile.</p>
              </div>
            )}
          </div>

          <FxConversionForm accounts={accounts} />

          <div className="pt-2">
            <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline">← Return to Dashboard Overview</Link>
          </div>

        </div>
      </main>
    </div>
  );
}