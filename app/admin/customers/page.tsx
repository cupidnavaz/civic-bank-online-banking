import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import AdminCustomerTable from "@/components/AdminCustomerTable";

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");
  const customers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, image: true, createdAt: true, accounts: { select: { balance: true } }, virtualCards: { select: { status: true } }, cryptoHoldings: { select: { asset: true, quantity: true } }, _count: { select: { transactions: true, notifications: true, auditLogs: true } } },
  });

  return <div className="min-h-screen bg-slate-950 text-slate-100"><header className="border-b border-slate-800 bg-slate-950/95"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"><Link href="/admin" className="text-sm font-semibold text-white">Civic<span className="text-red-400">Bank</span> Admin</Link><Link href="/dashboard" className="text-xs text-indigo-400">Customer view</Link></div></header><main className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">Customer operations</p><h1 className="mt-2 text-2xl font-semibold text-white">Customer directory</h1><p className="mt-2 text-sm text-slate-400">Control customer-facing banking products from one live operational view.</p></div><AdminCustomerTable initialCustomers={customers.map((customer) => ({ ...customer, createdAt: customer.createdAt.toISOString() }))} /></main></div>;
}