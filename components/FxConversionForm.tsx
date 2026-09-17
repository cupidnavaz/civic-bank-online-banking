"use client";

import { useState } from "react";
import { ArrowRightLeft, LoaderCircle } from "lucide-react";

type Account = { id: string; currency: string; balance: number };

export default function FxConversionForm({ accounts }: { accounts: Account[] }) {
  const currencies = Array.from(new Set(accounts.map((account) => account.currency)));
  const [fromCurrency, setFromCurrency] = useState(currencies[0] || "USD");
  const [toCurrency, setToCurrency] = useState(currencies[1] || "EUR");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function convert() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/fx/convert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fromCurrency, toCurrency, amount: Number(amount) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Conversion failed.");
      setStatus(`${fromCurrency} ${Number(amount).toLocaleString()} converted to ${toCurrency} ${Number(data.convertedAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}. Refresh your accounts to see the updated balances.`);
      setAmount("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Conversion failed.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6"><div className="flex items-start gap-3 border-b border-slate-800 pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400"><ArrowRightLeft size={17} aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-white">Convert currencies</h2><p className="mt-1 text-xs text-slate-400">Move funds between your existing currency accounts at the current demo rate.</p></div></div>{currencies.length < 2 ? <p className="mt-5 rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-xs text-slate-500">Add another currency account before converting funds.</p> : <><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_1fr] sm:items-end"><label className="text-xs font-medium text-slate-400">From<select value={fromCurrency} onChange={(event) => setFromCurrency(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500">{currencies.map((currency) => <option key={currency}>{currency}</option>)}</select></label><button type="button" aria-label="Swap currencies" onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} className="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 sm:flex"><ArrowRightLeft size={15} aria-hidden="true" /></button><label className="text-xs font-medium text-slate-400">To<select value={toCurrency} onChange={(event) => setToCurrency(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500">{currencies.filter((currency) => currency !== fromCurrency).map((currency) => <option key={currency}>{currency}</option>)}</select></label><label className="text-xs font-medium text-slate-400">Amount<input required min="0.01" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 font-mono text-sm text-slate-200 outline-none focus:border-indigo-500" /></label></div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p role="status" className="text-xs text-slate-400">{status}</p><button type="button" disabled={loading || !amount || fromCurrency === toCurrency} onClick={convert} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{loading && <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />}{loading ? "Converting..." : "Convert funds"}</button></div></>}</div>;
}