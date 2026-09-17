import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import TransactionTable from "@/components/TransactionTable";

export default async function TransactionsHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let transactions: any[] = [];
  try {
    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { transactions: { orderBy: { createdAt: "desc" } } } as any,
    });
    if (dbUser) transactions = (dbUser as any).transactions || [];
  } catch (err) {
    console.error("Transactions fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/transactions" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Master Transaction Ledger</h2>
            <p className="text-xs text-slate-400">Complete Historical Clearing Records & SWIFT Logs</p>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
            Encrypted Audit Stream
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <TransactionTable transactions={transactions} />

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}