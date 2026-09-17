import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default async function DevelopersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/developers" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">API & Webhook Management</h2>
            <p className="text-xs text-slate-400">Programmatic Payouts, Bearer Tokens, and Event Triggers</p>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
            API v2.4 Live
          </span>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* API Keys Section */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Live Production API Keys</h3>
                <p className="text-xs text-slate-400 mt-0.5">Use these keys to authenticate requests against the Clearing Hub backend endpoints.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/20">
                + Roll New Key
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Production Secret Key</span>
                  <span className="text-sm font-mono text-indigo-400 font-bold">cp_live_9981248810938481920391</span>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold">
                  Copy Key
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Endpoint Configuration */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">Webhook Endpoint URL</h3>
              <p className="text-xs text-slate-400 mt-0.5">We will POST JSON payloads for transaction settlements, deposits, and wire failures.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Destination Payload URL</label>
                <input type="text" defaultValue="https://api.maxdera.com/v1/webhooks/clearing" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" />
                <span className="text-xs text-slate-300">Subscribe to all ledger events (`transaction.completed`, `wire.approved`, `card.spent`)</span>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors">
                  Save Webhook Configuration
                </button>
              </div>
            </div>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}