"use client";

import { useState } from "react";
import { Check, CreditCard, LoaderCircle, ShoppingBag, Trash2, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

type Account = { id: string; currency: string; balance: number; status?: string };

export default function VirtualCardControls({ cardId, accounts, active }: { cardId: string; accounts: Account[]; active: boolean }) {
  const router = useRouter();
  const usdAccounts = accounts.filter((account) => account.currency === "USD" && account.status !== "CLOSED");
  const [accountId, setAccountId] = useState(usdAccounts[0]?.id || "");
  const [topupAmount, setTopupAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  async function send(path: string, body?: object) {
    setLoading(path);
    setMessage("");
    try {
      const response = await fetch(path, { method: "POST", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action failed.");
      setMessage(data.reference ? `Completed. Reference ${data.reference}.` : "Card terminated successfully.");
      setTopupAmount("");
      setMerchant("");
      setPurchaseAmount("");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setLoading("");
    }
  }

  function terminate() {
    if (window.confirm("Terminate this virtual card? This action cannot be undone.")) send(`/api/cards/${cardId}/terminate`);
  }

  if (!active) return <p className="mt-4 border-t border-slate-800 pt-4 text-[10px] font-semibold uppercase tracking-wider text-red-400">Card terminated</p>;

  return <div className="mt-5 space-y-3 border-t border-slate-800 pt-4"><div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]"><select aria-label="Funding account" value={accountId} onChange={(event) => setAccountId(event.target.value)} className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"><option value="">Funding account</option>{usdAccounts.map((account) => <option key={account.id} value={account.id}>USD · ${Number(account.balance).toLocaleString()}</option>)}</select><input aria-label="Top up amount" type="number" min="0.01" step="0.01" value={topupAmount} onChange={(event) => setTopupAmount(event.target.value)} placeholder="Top up amount" className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 font-mono text-xs text-slate-300 outline-none focus:border-indigo-500" /><button type="button" disabled={!accountId || !topupAmount || !!loading} onClick={() => send(`/api/cards/${cardId}/topup`, { accountId, amount: Number(topupAmount) })} className="inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{loading.includes("topup") ? <LoaderCircle size={12} className="animate-spin" aria-hidden="true" /> : <WalletCards size={12} aria-hidden="true" />} Top up</button></div><div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]"><input aria-label="Merchant" value={merchant} onChange={(event) => setMerchant(event.target.value)} placeholder="Product or merchant" className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500" /><input aria-label="Purchase amount" type="number" min="0.01" step="0.01" value={purchaseAmount} onChange={(event) => setPurchaseAmount(event.target.value)} placeholder="Purchase amount" className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 font-mono text-xs text-slate-300 outline-none focus:border-indigo-500" /><button type="button" disabled={!merchant || !purchaseAmount || !!loading} onClick={() => send(`/api/cards/${cardId}/purchase`, { merchant, amount: Number(purchaseAmount) })} className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{loading.includes("purchase") ? <LoaderCircle size={12} className="animate-spin" aria-hidden="true" /> : <ShoppingBag size={12} aria-hidden="true" />} Purchase</button></div><button type="button" onClick={terminate} disabled={!!loading} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"><Trash2 size={12} aria-hidden="true" /> Terminate card</button>{message && <p role="status" className="flex items-center gap-1.5 text-[10px] text-slate-400"><Check size={12} className="text-emerald-400" aria-hidden="true" />{message}</p>}</div>;
}