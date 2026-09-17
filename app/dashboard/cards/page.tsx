import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import VirtualCardForm from "@/components/VirtualCardForm";
import VirtualCardControls from "@/components/VirtualCardControls";

export default async function VirtualCardsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as any;

  let dbUser: any = null;
  let cards: any[] = [];
  try {
    dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: { virtualCards: { include: { purchases: { orderBy: { createdAt: "desc" }, take: 3 } } }, accounts: true } as any,
    });
    if (dbUser) cards = dbUser.virtualCards || [];
  } catch (err) {
    console.error("Virtual cards fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeRoute="/dashboard/cards" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Virtual Card Tokens & Spend Controls</h2>
            <p className="text-xs text-slate-400">Instant Issuance & Encrypted Pan Details</p>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
            Visa / Mastercard Infinite
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Active Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.length > 0 ? (
              cards.map((card: any) => (
                <div key={card.id} className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-mono font-bold tracking-widest text-indigo-400">{card.cardHolder || "VIRTUAL CARD"}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono uppercase">{card.status || "ACTIVE"}</span>
                    </div>

                    <div className="space-y-1 font-mono">
                      <p className="text-[10px] text-slate-400 uppercase">Card Number</p>
                      <p className="text-lg font-bold text-white tracking-wider">•••• •••• •••• {String(card.cardNumber || "").slice(-4)}</p>
                    </div>
                  </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Expires</span>
                      <span className="text-slate-300 font-semibold">{card.expiryDate || "12/28"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Spend Limit</span>
                      <span className="text-emerald-400 font-semibold">${Number(card.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">CVV</span>
                      <span className="text-indigo-400 font-semibold">•••</span>
                    </div>
                  </div>
                  <VirtualCardControls cardId={card.id} accounts={dbUser?.accounts || []} active={card.status === "ACTIVE"} />
                  {card.purchases?.length > 0 && <div className="mt-3 border-t border-slate-800 pt-3 text-[10px] text-slate-500">Last purchase: {card.purchases[0].merchant} · ${Number(card.purchases[0].amount).toFixed(2)}</div>}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 px-6 py-14 text-center">
                <p className="text-sm font-semibold text-slate-300">No virtual cards issued</p>
                <p className="mt-1 text-xs text-slate-500">Cards will appear here once they are provisioned for this profile.</p>
              </div>
            )}
          </div>

          <VirtualCardForm />

          <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline block">← Return to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}