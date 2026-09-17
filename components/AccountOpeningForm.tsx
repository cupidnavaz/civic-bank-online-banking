"use client";

import { useState } from "react";
import { Check, LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountOpeningForm() {
  const router = useRouter();
  const [currency, setCurrency] = useState("EUR");
  const [type, setType] = useState("CHECKING");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function openAccount() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currency, type }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to open account.");
      setStatus(`${currency} ${type.toLowerCase()} account opened successfully.`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to open account.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-sm font-semibold text-white">Open another account</h2><p className="mt-1 text-xs text-slate-400">Add a supported currency account to organize your money.</p></div><div className="flex flex-col gap-2 sm:flex-row"><select value={currency} onChange={(event) => setCurrency(event.target.value)} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"><option>EUR</option><option>GBP</option><option>USD</option></select><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"><option value="CHECKING">Checking</option><option value="SAVINGS">Savings</option></select><button type="button" onClick={openAccount} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />} {loading ? "Opening..." : "Open account"}</button></div></div>{status && <p role="status" className="mt-3 flex items-center gap-1.5 text-xs text-slate-300"><Check size={14} className="text-emerald-400" aria-hidden="true" />{status}</p>}</div>;
}