import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import AdminResourceManager from "@/components/AdminResourceManager";

export default async function AdminDataPage() { const session = await getServerSession(authOptions); if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard"); return <AdminShell activeRoute="/admin/data"><div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8"><div><p className="text-[10px] uppercase tracking-widest text-red-400">Data operations</p><h1 className="mt-2 text-2xl font-semibold text-white">Website data manager</h1><p className="mt-2 text-sm text-slate-400">Manage users, accounts, transactions, cards, crypto holdings, and news content from one controlled workspace.</p></div><AdminResourceManager /></div></AdminShell>; }