import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import NotificationCenter from "@/components/NotificationCenter";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) redirect("/login");

  const notifications = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });

  return <div className="flex min-h-screen bg-slate-950 text-slate-100"><Sidebar activeRoute="/dashboard/notifications" /><main className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0"><header className="flex h-16 items-center border-b border-slate-800/80 px-5 sm:px-8"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">Account activity</p><h1 className="mt-0.5 text-lg font-semibold text-white">Notifications</h1></div></header><div className="mx-auto w-full max-w-3xl space-y-6 p-5 sm:p-8"><div><h2 className="text-xl font-semibold text-white">Stay up to date</h2><p className="mt-1 text-sm text-slate-400">Security, transfer, and account updates for your profile.</p></div><NotificationCenter initialNotifications={notifications} /></div></main></div>;
}