import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardAlerts from "@/components/DashboardAlerts";
import {
  ArrowLeftRight,
  BriefcaseBusiness,
  ChevronRight,
  CreditCard,
  Bitcoin,
  FileText,
  Globe2,
  Home,
  Landmark,
  LifeBuoy,
  LogOut,
  PiggyBank,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

export default async function Sidebar({ activeRoute }: { activeRoute: string }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  let notifications: any[] = [];

  if (user?.email) {
    try {
      const dbUser = await db.user.findUnique({
        where: { email: user.email },
        select: { notifications: { orderBy: { createdAt: "desc" }, take: 8 } },
      });
      notifications = dbUser?.notifications || [];
    } catch (error) {
      console.error("Sidebar notifications error:", error);
    }
  }
  const navGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Accounts", href: "/dashboard/accounts", icon: Landmark },
        { name: "Transactions", href: "/dashboard/transactions", icon: FileText },
      ],
    },
    {
      label: "Move money",
      items: [
        { name: "Transfers", href: "/dashboard/transfers", icon: ArrowLeftRight },
        { name: "Deposits", href: "/dashboard/deposits", icon: WalletCards },
        { name: "Withdrawals", href: "/dashboard/withdrawals", icon: CreditCard },
        { name: "Beneficiaries", href: "/dashboard/beneficiaries", icon: Users },
      ],
    },
    {
      label: "Plan & grow",
      items: [
        { name: "Savings", href: "/dashboard/savings", icon: PiggyBank },
        { name: "Investments", href: "/dashboard/investments", icon: BriefcaseBusiness },
        { name: "Crypto", href: "/dashboard/crypto", icon: Bitcoin },
        { name: "Loans", href: "/dashboard/loans", icon: Landmark },
      ],
    },
    {
      label: "Manage",
      items: [
        { name: "Statements", href: "/dashboard/statements", icon: FileText },
        { name: "Notifications", href: "/dashboard/notifications", icon: ShieldCheck },
        { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
    {
      label: "Public website",
      items: [
        { name: "Website home", href: "/", icon: Globe2 },
        { name: "Investment center", href: "/investments", icon: BriefcaseBusiness },
      ],
    },
  ];

  const mobileItems = navGroups.flatMap((group) => group.items).filter((item) => ["Dashboard", "Accounts", "Transfers", "Notifications", "Settings"].includes(item.name));

  return (
    <>
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 md:flex">
        <div className="border-b border-slate-800 px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-black text-white">C</span>
            Civic<span className="text-indigo-400">Bank</span>
          </Link>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Personal banking</p>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-500/30 bg-indigo-600/20 font-bold text-indigo-400">
          {user?.image ? (
            <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
          ) : (
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : "C"}</span>
          )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{user?.name || "Valued Client"}</p>
            <p className="truncate text-[10px] text-slate-400">{user?.email || "client@civicbank.com"}</p>
          </div>
          <div className="flex items-center gap-2">
            {activeRoute !== "/dashboard" && <DashboardAlerts initialNotifications={notifications} />}
            <ChevronRight size={15} className="text-slate-600" aria-hidden="true" />
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">{group.label}</p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.href;
                  return (
                    <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300" : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}>
                      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <Link href="/" className="mb-3 flex items-center justify-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 py-2 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/10 hover:text-white">
            <Globe2 size={14} aria-hidden="true" />
            Visit public website
          </Link>
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-400">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Protected session</span>
          </div>
          <Link href="/api/auth/signout" className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20">
            <LogOut size={15} aria-hidden="true" />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-800 bg-slate-950/95 px-2 py-2 backdrop-blur md:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.href;
          return <Link key={item.name} href={item.href} className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] ${isActive ? "text-indigo-300" : "text-slate-500"}`}><Icon size={17} aria-hidden="true" /><span>{item.name}</span></Link>;
        })}
      </nav>
    </>
  );
}