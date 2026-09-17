"use client";

import { useState } from "react";
import { Check, CreditCard, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VirtualCardForm() {
  const router = useRouter();
  const [cardHolder, setCardHolder] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function createCard() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/cards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardHolder }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to issue card.");
      setCardHolder("");
      setStatus(`Virtual card ending in ${data.card.cardNumber.slice(-4)} is active.`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to issue card.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"><div className="flex items-start gap-3 border-b border-slate-800 pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400"><CreditCard size={17} aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-white">Create a virtual card</h2><p className="mt-1 text-xs text-slate-400">Issue a demo card for online spending. Card details are shown only in masked form.</p></div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1 text-xs font-medium text-slate-400">Cardholder name<span className="text-slate-600"> (optional)</span><input value={cardHolder} onChange={(event) => setCardHolder(event.target.value)} maxLength={80} placeholder="Use your profile name" className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" /></label><button type="button" onClick={createCard} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <CreditCard size={14} aria-hidden="true" />}{loading ? "Issuing..." : "Issue virtual card"}</button></div>{status && <p role="status" className="mt-3 flex items-center gap-1.5 text-xs text-slate-300"><Check size={14} className="text-emerald-400" aria-hidden="true" />{status}</p>}</div>;
}