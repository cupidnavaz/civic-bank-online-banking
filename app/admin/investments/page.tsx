import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import AdminCrudTable from "@/components/AdminCrudTable";

export default async function InvestmentPlans() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");
  return <AdminShell activeRoute="/admin/investments"><div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-8"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-red-400">Product catalog</p><h1 className="mt-2 text-2xl font-semibold text-white">Investment plans</h1><p className="mt-2 text-sm text-slate-400">Manage displayed products, minimum amounts, terms, and target returns.</p></div><AdminCrudTable title="Investment products" rows={[{ id: "PLAN-01", name: "Starter Growth", status: "ACTIVE", detail: "NGN 50,000 minimum · 90 days" }, { id: "PLAN-02", name: "Balanced Wealth", status: "ACTIVE", detail: "NGN 250,000 minimum · 180 days" }, { id: "PLAN-03", name: "Premium Capital", status: "ACTIVE", detail: "NGN 1,000,000 minimum · 365 days" }]} /></div></AdminShell>;
}
