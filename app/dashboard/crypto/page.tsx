import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import CryptoPurchaseForm from "@/components/CryptoPurchaseForm";
import Link from "next/link";

export default async function CryptoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");
  const user = await db.user.findUnique({ where: { email: session.user.email }, include: { accounts: true, cryptoHoldings: true } });
  if (!user) redirect("/login");

  return <div className="flex min-h-screen bg-slate-950 text-slate-100"><Sidebar activeRoute="/dashboard/crypto" /><main className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-20 md:pb-0"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-5 backdrop-blur-md sm:px-8"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400">Digital assets</p><h1 className="mt-0.5 text-lg font-semibold text-white">Crypto wallet</h1></div><span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">Demo market</span></header><div className="mx-auto w-full max-w-5xl space-y-6 p-5 sm:p-8"><div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"><p className="text-xs leading-5 text-amber-100/80">This is a demonstration wallet using fixed sample prices. It is not connected to a blockchain, exchange, custody provider, or real crypto market.</p></div><CryptoPurchaseForm accounts={user.accounts} /><section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl"><div className="border-b border-slate-800 p-5"><h2 className="text-sm font-semibold text-white">Your holdings</h2><p className="mt-1 text-xs text-slate-400">Assets purchased through this demo account.</p></div>{user.cryptoHoldings.length ? <div className="divide-y divide-slate-800">{user.cryptoHoldings.map((holding) => <div key={holding.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-mono text-sm font-semibold text-white">{holding.asset}</p><p className="mt-1 text-xs text-slate-500">Average demo price ${holding.averagePrice.toLocaleString()}</p></div><p className="font-mono text-sm text-amber-300">{holding.quantity.toFixed(8)}</p></div>)}</div> : <p className="px-5 py-12 text-center text-xs text-slate-500">No digital assets held yet.</p>}</section><Link href="/dashboard" className="text-xs text-indigo-400 hover:underline">Return to dashboard</Link></div></main></div>;
}