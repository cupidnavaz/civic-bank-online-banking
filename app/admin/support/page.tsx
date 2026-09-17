import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import AdminSupportInbox from "@/components/AdminSupportInbox";
export default async function AdminSupportPage() { const session = await getServerSession(authOptions); if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard"); const tickets = await db.supportTicket.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 }); return <AdminShell activeRoute="/admin/support"><div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-8"><div><p className="text-[10px] uppercase tracking-widest text-red-400">Customer care</p><h1 className="mt-2 text-2xl font-semibold text-white">Support inbox</h1></div><AdminSupportInbox initialTickets={tickets} /></div></AdminShell>; }