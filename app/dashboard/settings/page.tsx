import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ProfileSettings from "./ProfileSettings";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let dbUser: any = null;
  try {
    dbUser = await db.user.findUnique({
      where: { email: user.email },
    });
  } catch (err) {
    console.error("Settings fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/settings" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Account Settings & Security Suite</h2>
            <p className="text-xs text-slate-400">Manage Profile, Password, Bio, and Transaction PIN</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
            Tier-3 Verified
          </span>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto space-y-8">
          
          <ProfileSettings initialImage={dbUser?.image} initialName={dbUser?.name || user?.name} email={dbUser?.email || user?.email || ""} />

          {/* Password Update Section */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-base font-semibold text-slate-200 border-b border-slate-800 pb-4">Change Account Password</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors">
                Update Password
              </button>
            </div>
          </div>

          {/* Transaction PIN Section */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-base font-semibold text-slate-200 border-b border-slate-800 pb-4">Transaction Authorization PIN (4-Digit)</h3>
            <p className="text-xs text-slate-400">Required when dispatching outbound wire transfers or modifying virtual card limits.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Current PIN</label>
                <input type="password" maxLength={4} placeholder="••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono tracking-widest focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">New 4-Digit PIN</label>
                <input type="password" maxLength={4} placeholder="••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono tracking-widest focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm New PIN</label>
                <input type="password" maxLength={4} placeholder="••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono tracking-widest focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors">
                Update Transaction PIN
              </button>
            </div>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}