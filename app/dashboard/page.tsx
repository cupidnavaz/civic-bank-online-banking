import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import DashboardAlerts from "@/components/DashboardAlerts";
import DashboardProfileCard from "@/components/DashboardProfileCard";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, CreditCard, FileText, Plus, Send, ShieldCheck, WalletCards } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let dbUser: any = null;
  let accounts: any[] = [];
  let virtualCards: any[] = [];
  let transactions: any[] = [];
  let notifications: any[] = [];

  try {
    dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: {
        accounts: true,
        virtualCards: true,
        transactions: { orderBy: { createdAt: "desc" }, take: 100 },
        notifications: { orderBy: { createdAt: "desc" }, take: 8 },
      } as any,
    });
    if (dbUser) {
      accounts = dbUser.accounts || [];
      virtualCards = dbUser.virtualCards || [];
      transactions = dbUser.transactions || [];
      notifications = dbUser.notifications || [];
    }
  } catch (err) {
    console.error("Dashboard database fetch error:", err);
  }

  const totalBalance = accounts.reduce((total, account) => total + Number(account.balance || 0), 0);
  const firstName = dbUser?.firstName || dbUser?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "there";
  const monthly = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index), 1);
    const monthTransactions = transactions.filter((transaction) => {
      const createdAt = new Date(transaction.createdAt);
      return createdAt.getFullYear() === date.getFullYear() && createdAt.getMonth() === date.getMonth();
    });
    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      income: monthTransactions.filter((transaction) => ["DEPOSIT", "CREDIT"].includes(transaction.type)).reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
      outgoing: monthTransactions.filter((transaction) => !["DEPOSIT", "CREDIT"].includes(transaction.type)).reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
    };
  });
  const allocation = accounts.filter((account) => Number(account.balance || 0) > 0).map((account, index) => ({ name: `${account.currency || "USD"} account`, value: Number(account.balance || 0), color: ["#818cf8", "#34d399", "#f59e0b", "#38bdf8"][index % 4] }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard" />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-20 md:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">Personal banking</p>
            <h2 className="mt-0.5 text-lg font-semibold text-white">Good morning, {firstName}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 sm:flex"><ShieldCheck size={13} aria-hidden="true" /> Protected</span>
            <DashboardAlerts initialNotifications={notifications} />
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-indigo-500/40 bg-indigo-600/20 text-sm font-bold text-indigo-400">
              {dbUser?.image ? <img src={dbUser.image} alt={`${dbUser?.name || "User"} profile`} className="h-full w-full object-cover" /> : (dbUser?.name || user?.name || "C")[0]}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="mx-auto w-full max-w-7xl space-y-6 p-5 sm:space-y-8 sm:p-8">

          {/* Quick Metrics & Net Worth Banner */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 shadow-xl xl:col-span-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Total balance</span>
                <div className="mt-2 font-mono text-3xl font-bold text-white">
                  ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <p className="mt-2 text-xs text-slate-400">Across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                <span>Available funds</span>
                <span className="font-semibold text-emerald-400">Ready to use</span>
              </div>
            </div>

            <Link href="/dashboard/deposits" className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-colors hover:border-emerald-500/30 hover:bg-slate-900/80">
              <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><ArrowDownToLine size={18} aria-hidden="true" /></span><ArrowUpRight size={16} className="text-slate-600 transition-colors group-hover:text-emerald-400" aria-hidden="true" /></div>
              <div><h3 className="mt-5 text-sm font-semibold text-white">Add money</h3><p className="mt-1 text-[11px] text-slate-400">Deposit funds into your account.</p></div>
            </Link>

            <Link href="/dashboard/transfers" className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-colors hover:border-indigo-500/30 hover:bg-slate-900/80">
              <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400"><Send size={17} aria-hidden="true" /></span><ArrowUpRight size={16} className="text-slate-600 transition-colors group-hover:text-indigo-400" aria-hidden="true" /></div>
              <div><h3 className="mt-5 text-sm font-semibold text-white">Send money</h3><p className="mt-1 text-[11px] text-slate-400">Make a transfer to a beneficiary.</p></div>
            </Link>
          </div>

          {/* Quick Hub Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <span className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Tools & services</span>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard/cards" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800">
                <CreditCard size={14} aria-hidden="true" /> Cards
              </Link>
              <Link href="/dashboard/beneficiaries" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800">
                <WalletCards size={14} aria-hidden="true" /> Beneficiaries
              </Link>
              <Link href="/dashboard/statements" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800">
                <FileText size={14} aria-hidden="true" /> Statements
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-600/10 px-3.5 py-2 text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-600/20">
                <Plus size={14} aria-hidden="true" /> Manage account
              </Link>
            </div>
          </div>

          <DashboardProfileCard name={dbUser?.name || user?.name || "CivicBank customer"} email={dbUser?.email || user?.email || ""} role={dbUser?.role || user?.role || "CUSTOMER"} image={dbUser?.image} />

          <DashboardAnalytics monthly={monthly} allocation={allocation} />

          {/* Active Vault Balances & Virtual Cards Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Vault Accounts List */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white">Treasury Currency Vaults</h3>
                <Link href="/dashboard/accounts" className="text-xs text-indigo-400 hover:underline">Manage accounts</Link>
              </div>
              <div className="space-y-3">
                {accounts.length > 0 ? accounts.slice(0, 3).map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-bold text-slate-200">{account.type || "Checking"} account</span>
                      <span className="mt-1 block truncate font-mono text-[10px] text-slate-400">{account.currency || "USD"} · {account.accountNumber ? `•••• ${String(account.accountNumber).slice(-4)}` : "Account"}</span>
                    </div>
                    <span className="ml-3 shrink-0 font-mono text-sm font-bold text-emerald-400">{account.currency === "EUR" ? "€" : account.currency === "GBP" ? "£" : "$"}{Number(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-xs text-slate-500">No accounts are linked to this profile yet.</div>
                )}
              </div>
            </div>

            {/* Virtual Cards Preview */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white">Active Virtual Cards</h3>
                <Link href="/dashboard/cards" className="text-xs text-indigo-400 hover:underline">View All Cards →</Link>
              </div>
              <div className="space-y-3">
                {virtualCards.length > 0 ? virtualCards.slice(0, 2).map((card: any) => (
                  <div key={card.id} className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 to-slate-950 p-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-400">{card.cardHolder || "Virtual card"}</span>
                      <span className="mt-1 block font-mono text-xs text-white">•••• {String(card.cardNumber || "").slice(-4)}</span>
                    </div>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">{card.status || "ACTIVE"}</span>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-xs text-slate-500">No virtual cards are active.</div>
                )}
                <Link href="/dashboard/cards" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300">Manage cards <ArrowUpRight size={13} aria-hidden="true" /></Link>
              </div>
            </div>

          </div>

          {/* Recent Transaction Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-slate-200">Recent Transaction Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time record of settlements, wires, and deposits.</p>
              </div>
              <Link href="/dashboard/audit" className="text-xs text-indigo-400 hover:underline">Full Audit Log</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3.5 px-6">Reference / Description</th>
                    <th className="py-3.5 px-6">Channel</th>
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  {transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-medium text-white text-xs">{tx.description || "Capital Settlement Wire"}</td>
                        <td className="py-4 px-6 font-mono text-xs text-indigo-400">{tx.type || "SWIFT"}</td>
                        <td className="py-4 px-6 text-xs text-slate-400">{new Date(tx.createdAt).toLocaleString()}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`px-2.5 py-1 text-xs rounded-full font-medium border ${tx.status === "FAILED" ? "border-red-500/20 bg-red-500/10 text-red-400" : tx.status === "PENDING" ? "border-amber-500/20 bg-amber-500/10 text-amber-400" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"}`}>{tx.status || "COMPLETED"}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-500">Your recent transactions will appear here.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}