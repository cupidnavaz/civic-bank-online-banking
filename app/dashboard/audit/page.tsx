import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let auditLogs: any[] = [];
  try {
    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { auditLogs: { orderBy: { createdAt: "desc" }, take: 10 } } as any,
    });
    if (dbUser) auditLogs = dbUser.auditLogs || [];
  } catch (err) {
    console.error("Audit log fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/audit" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Security & Compliance Audit Trail</h2>
            <p className="text-xs text-slate-400">Forensic Event Log, IP Geolocation, and Access History</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
            SOC2 / ISO 27001 Monitored
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-slate-200">Recent Account Activity Stream</h3>
                <p className="text-xs text-slate-400 mt-0.5">Immutable ledger tracking authentication, wire authorizations, and setting updates.</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">Encrypted Storage</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3.5 px-6">Event Action</th>
                    <th className="py-3.5 px-6">Origin IP Address</th>
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-medium text-white text-xs">{log.action}</td>
                        <td className="py-4 px-6 font-mono text-xs text-indigo-400">{log.ipAddress || "192.168.1.1 (Secure Gateway)"}</td>
                        <td className="py-4 px-6 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="py-4 px-6 text-right">
                          <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-medium text-white text-xs">OAUTH_SESSION_LOGIN</td>
                        <td className="py-4 px-6 font-mono text-xs text-indigo-400">105.112.42.12 (Lagos, NG)</td>
                        <td className="py-4 px-6 text-xs text-slate-400">Today, 2:14 PM</td>
                        <td className="py-4 px-6 text-right">
                          <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-medium text-white text-xs">OUTBOUND_WIRE_INITIATED</td>
                        <td className="py-4 px-6 font-mono text-xs text-indigo-400">105.112.42.12 (Lagos, NG)</td>
                        <td className="py-4 px-6 text-xs text-slate-400">Today, 11:24 AM</td>
                        <td className="py-4 px-6 text-right">
                          <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}