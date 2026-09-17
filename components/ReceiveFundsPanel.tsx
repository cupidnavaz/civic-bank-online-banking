"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

type Account = { id: string; currency: string; type: string; accountNumber: string };

export default function ReceiveFundsPanel({ accounts }: { accounts: Account[] }) {
  const [selectedId, setSelectedId] = useState(accounts[0]?.id || "");
  const [copied, setCopied] = useState(false);
  const account = accounts.find((item) => item.id === selectedId);

  async function copyAccountNumber() {
    if (!account) return;
    await navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Receive funds</p><h2 className="mt-1 text-base font-semibold text-white">Share your CivicBank account</h2><p className="mt-1 text-xs text-slate-400">Give this account number to another CivicBank customer to receive an instant internal transfer.</p></div><Download size={18} className="text-emerald-400" aria-hidden="true" /></div>{account ? <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="text-xs font-medium text-slate-400">Receiving account<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 sm:w-56">{accounts.map((item) => <option key={item.id} value={item.id}>{item.currency} {item.type.toLowerCase()}</option>)}</select></label><div className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"><span className="font-mono text-sm text-white">{account.accountNumber}</span><button type="button" onClick={copyAccountNumber} aria-label="Copy account number" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300">{copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy"}</button></div></div> : <p className="mt-5 text-xs text-slate-500">Open an account to receive funds.</p>}</div>;
}