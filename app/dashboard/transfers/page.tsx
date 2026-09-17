import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import TransferForm from "@/components/TransferForm";

export default async function TransfersPage() {
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
    console.error("Transfers accounts fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/transfers" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Global Wire Transfer Center</h2>
            <p className="text-xs text-slate-400">Secure Multi-Stage SWIFT / Fedwire Execution Engine</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
              Stage 1 of 3: Routing Details
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl space-y-6 p-5 sm:p-8">
          <TransferForm accounts={accounts} />

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}