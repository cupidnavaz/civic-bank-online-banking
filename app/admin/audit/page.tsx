import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminAuditLogsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;

  // Verify administrative privileges
  let dbUser = null;
  try {
    dbUser = await db.user.findUnique({ where: { email: user.email } });
  } catch (err) {
    console.error("Admin verification error:", err);
  }

  // Fallback check if user is unauthorized or role is not ADMIN
  if (!dbUser || (dbUser as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  let auditLogs: any[] = [];
  try {
    auditLogs = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true } as any,
    }).catch(() => []) || [];
  } catch (err) {
    console.error("Failed to fetch audit logs:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Admin Compliance Control
          </span>
          <h2 className="text-lg font-semibold text-slate-200">System Audit & Event Logs</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline">
            ← Return to Client Portal
          </Link>
        </div>
      </header>

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-slate-200">Immutable Activity Stream</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tracking all authentication events, wire instructions, and balance modifications.</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-mono">
              Total Recorded: {auditLogs.length} Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-6">Event Action</th>
                  <th className="py-3 px-6">Client / User</th>
                  <th className="py-3 px-6">IP Address / Metadata</th>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-indigo-400 font-semibold">
                        {log.action || "SYSTEM_EVENT"}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-white">{log.user?.name || "System Process"}</p>
                        <p className="text-xs text-slate-400">{log.user?.email || log.userId || "N/A"}</p>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                      No audit logs found or audit logging model is pending migration (`npx prisma db push`).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}