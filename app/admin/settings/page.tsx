import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import AdminSettingsForm from "@/components/AdminSettingsForm";
export default async function AdminSettingsPage() { const session = await getServerSession(authOptions); if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard"); const settings = await db.adminSetting.findMany(); const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value])); return <AdminShell activeRoute="/admin/settings"><div className="mx-auto max-w-3xl space-y-6 p-5 sm:p-8"><div><p className="text-[10px] uppercase tracking-widest text-red-400">Configuration</p><h1 className="mt-2 text-2xl font-semibold text-white">Admin settings</h1></div><AdminSettingsForm initialValues={values} /></div></AdminShell>; }