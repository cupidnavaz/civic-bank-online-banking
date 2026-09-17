import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let pendingTransactions: any[] = [];
  try {
    pendingTransactions = await db.transaction.findMany({
      where: { status: "PENDING_APPROVAL" },
      orderBy: { createdAt: "desc" },
    }).catch(() => []);
  } catch (err) {
    console.error("Approvals fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/approvals" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Multi-Sig Governance Queue</h2>
            <p className="text-xs text-slate-400">Institutional Two-Officer Authorization Policy</p>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-mono">
            {pendingTransactions.length} Pending Sign-off
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-200">Transactions Awaiting Executive Authorization</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cryptographic signing keys or hardware token confirmation required.</p>
            </div>

            <div className="divide-y divide-slate-800">
              {pendingTransactions.length > 0 ? (
                pendingTransactions.map((tx: any) => (
                  <div key={tx.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-indigo-400 font-bold">{tx.reference || tx.id}</span>
                        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-medium">PENDING APPROVAL</span>
                      </div>
                      <div className="text-lg font-bold text-white font-mono mt-2">
                        ${Number(tx.amount || 0).toLocaleString()} {tx.currency || "USD"}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Initiated on {new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors">
                        Approve & Broadcast
                      </button>
                      <button className="px-4 py-2 bg-rose-600/20 border border-rose-500/30 hover:bg-rose-600/30 text-rose-300 rounded-xl text-xs font-semibold transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-slate-400">No transactions currently waiting in the governance queue.</p>
                  <p className="text-xs text-slate-500 mt-1">All outbound transfers have been fully settled or cleared.</p>
                </div>
              )}
            </div>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}