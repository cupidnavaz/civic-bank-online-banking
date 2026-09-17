import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import SupportTicketForm from "@/components/SupportTicketForm";

export default async function SupportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/support" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Institutional Support & Compliance Desk</h2>
            <p className="text-xs text-slate-400">Dedicated Relationship Manager & 24/7 Priority Secure Ticketing</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
            VIP Priority Support Active
          </span>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto space-y-8">
          <SupportTicketForm />
          <div className="hidden bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">Open Priority Compliance or Technical Ticket</h3>
              <p className="text-xs text-slate-400 mt-0.5">Encrypted communications routed directly to your institutional relationship desk.</p>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Inquiry Classification</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
                    <option>Wire Transfer & SWIFT Clearing Assistance</option>
                    <option>AML & Compliance Documentation</option>
                    <option>Treasury Yield & Account Structuring</option>
                    <option>Technical API / Security Integration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Urgency Level</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
                    <option>Standard (Response within 4 hours)</option>
                    <option>High Priority (Response within 1 hour)</option>
                    <option>Critical / Active Transaction Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Message / Inquiry Details</label>
                <textarea rows={4} placeholder="Describe your request or reference specific transaction IDs..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"></textarea>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Dedicated Manager: <span className="text-white font-semibold">Victoria Sterling (v.sterling@civicprime.com)</span>
                </div>
                <button type="button" className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20">
                  Dispatch Encrypted Ticket
                </button>
              </div>
            </form>
          </div>

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}