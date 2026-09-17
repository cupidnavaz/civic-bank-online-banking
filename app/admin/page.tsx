import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import AdminAnalytics from "@/components/AdminAnalytics";
import Link from "next/link";

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");
  const [customers, accounts, transactions, cards, holdings, auditLogs, unreadNotifications, recentTransactions] = await Promise.all([
    db.user.count(), db.account.count(), db.transaction.count(), db.virtualCard.count({ where: { status: "ACTIVE" } }), db.cryptoHolding.count(), db.auditLog.count(), db.notification.count({ where: { isRead: false } }), db.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  const chart = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setMonth(date.getMonth() - (5 - index), 1); const rows = recentTransactions.filter((row) => { const created = new Date(row.createdAt); return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear(); }); return { label: date.toLocaleDateString("en-US", { month: "short" }), transactions: rows.length, volume: rows.reduce((sum, row) => sum + Number(row.amount || 0), 0) }; });
  const metrics = [["Customers", customers, "/admin/customers"], ["Accounts", accounts, "/admin/customers"], ["Transactions", transactions, "/admin/audit"], ["Active cards", cards, "/admin/customers"], ["Crypto holdings", holdings, "/admin/customers"], ["Unread alerts", unreadNotifications, "/admin/audit"], ["Audit events", auditLogs, "/admin/audit"]];
  return <AdminShell activeRoute="/admin"><div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8"><div><p className="text-[10px] uppercase tracking-[0.18em] text-red-400">Operations control center</p><h1 className="mt-2 text-2xl font-semibold text-white">Manage CivicBank</h1><p className="mt-2 text-sm text-slate-400">Live operations, customer care, content publishing, settings, and risk review.</p></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{metrics.map(([label, value, href]) => <Link key={label as string} href={href as string} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl hover:border-red-500/30"><p className="text-xs text-slate-400">{label as string}</p><p className="mt-2 font-mono text-2xl font-semibold text-white">{Number(value).toLocaleString()}</p></Link>)}</div><AdminAnalytics data={chart} /><div className="grid grid-cols-1 gap-5 md:grid-cols-3"><Link href="/admin/support" className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5"><h2 className="text-sm font-semibold text-white">Review support emails</h2><p className="mt-2 text-xs text-slate-400">Triage and resolve customer requests.</p></Link><Link href="/admin/announcements" className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"><h2 className="text-sm font-semibold text-white">Post across channels</h2><p className="mt-2 text-xs text-slate-400">Publish in-app announcements and prepare connector posts.</p></Link><Link href="/admin/settings" className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-semibold text-white">Configure platform</h2><p className="mt-2 text-xs text-slate-400">Manage maintenance, support, and default settings.</p></Link></div></div></AdminShell>;
}
