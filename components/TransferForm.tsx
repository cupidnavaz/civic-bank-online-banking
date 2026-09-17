"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Send } from "lucide-react";

type Account = { id: string; currency: string; balance: number; accountNumber: string };

export default function TransferForm({ accounts }: { accounts: Account[] }) {
  const [isInternal, setIsInternal] = useState(true);
  const [form, setForm] = useState({ accountId: accounts[0]?.id || "", recipientName: "", recipientBank: "", accountNumber: "", recipientAccountNumber: "", swiftCode: "", amount: "", narration: "" });
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ reference: string; status: string } | null>(null);

  const account = accounts.find((item) => item.id === form.accountId);
  const update = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  function reviewTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!account) return setError("Select a source account.");
    if (Number(form.amount) <= 0) return setError("Enter an amount greater than zero.");
    if (Number(form.amount) > Number(account.balance)) return setError("The transfer amount exceeds the available account balance.");
    if (isInternal && !form.recipientAccountNumber.trim()) return setError("Enter the recipient's CivicBank account number.");
    setReviewing(true);
  }

  async function submitTransfer() {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/transactions/transfer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit transfer.");
      setResult({ reference: data.reference, status: data.status });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to submit transfer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center"><CheckCircle2 className="mx-auto text-emerald-400" size={42} aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-white">Transfer submitted</h3><p className="mt-2 text-sm text-slate-400">Reference <span className="font-mono text-indigo-300">{result.reference}</span></p><p className="mt-1 text-xs text-slate-500">Status: {result.status}</p><button type="button" onClick={() => { setResult(null); setForm((current) => ({ ...current, amount: "", narration: "" })); }} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700">Start another transfer</button></div>;
  }

  if (reviewing) {
    return <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"><div className="border-b border-slate-800 pb-4"><p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Step 2 of 2</p><h3 className="mt-1 text-base font-semibold text-white">Review transfer details</h3></div><div className="space-y-3 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">From</span><span className="font-mono text-slate-200">{account?.currency} •••• {account?.accountNumber.slice(-4)}</span></div><div className="flex justify-between gap-4"><span className="text-slate-400">Recipient</span><span className="text-right text-slate-200">{form.recipientName || "CivicBank customer"}<br /><span className="font-mono text-xs text-slate-500">•••• {(isInternal ? form.recipientAccountNumber : form.accountNumber).slice(-4)}</span></span></div><div className="flex justify-between gap-4 border-t border-slate-800 pt-3"><span className="font-semibold text-slate-300">Amount</span><span className="font-mono text-lg font-semibold text-white">{account?.currency} {Number(form.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div></div>{error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}<div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-between"><button type="button" onClick={() => setReviewing(false)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"><ArrowLeft size={14} aria-hidden="true" /> Edit details</button><button type="button" disabled={submitting} onClick={submitTransfer} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{submitting && <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />}{submitting ? "Submitting..." : "Confirm transfer"}</button></div></div>;
  }

  return <form onSubmit={reviewTransfer} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"><div className="border-b border-slate-800 pb-4"><p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Step 1 of 2</p><h3 className="mt-1 text-base font-semibold text-white">Enter transfer details</h3><p className="mt-1 text-xs text-slate-400">Review every transfer before it is submitted.</p></div><div className="flex gap-2 rounded-xl bg-slate-950 p-1"><button type="button" onClick={() => setIsInternal(true)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${isInternal ? "bg-indigo-600 text-white" : "text-slate-500"}`}>CivicBank account</button><button type="button" onClick={() => setIsInternal(false)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${!isInternal ? "bg-indigo-600 text-white" : "text-slate-500"}`}>External wire</button></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><label className="text-xs font-medium text-slate-400">From account<select required value={form.accountId} onChange={(event) => update("accountId", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500">{accounts.map((item) => <option key={item.id} value={item.id}>{item.currency} account · {item.currency} {Number(item.balance).toLocaleString()}</option>)}</select></label><label className="text-xs font-medium text-slate-400">Amount<input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => update("amount", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-200 outline-none focus:border-indigo-500" /></label><label className="text-xs font-medium text-slate-400">Recipient name<input required={!isInternal} value={form.recipientName} onChange={(event) => update("recipientName", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" /></label>{isInternal ? <label className="text-xs font-medium text-slate-400">CivicBank account number<input required value={form.recipientAccountNumber} onChange={(event) => update("recipientAccountNumber", event.target.value)} placeholder="CB-..." className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-200 outline-none focus:border-indigo-500" /></label> : <><label className="text-xs font-medium text-slate-400">Bank name<input required value={form.recipientBank} onChange={(event) => update("recipientBank", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" /></label><label className="text-xs font-medium text-slate-400">Account number / IBAN<input required value={form.accountNumber} onChange={(event) => update("accountNumber", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-200 outline-none focus:border-indigo-500" /></label><label className="text-xs font-medium text-slate-400">SWIFT / BIC<input value={form.swiftCode} onChange={(event) => update("swiftCode", event.target.value.toUpperCase())} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm uppercase text-slate-200 outline-none focus:border-indigo-500" /></label></>}</div><label className="block text-xs font-medium text-slate-400">Transfer note<span className="text-slate-600"> (optional)</span><input value={form.narration} onChange={(event) => update("narration", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" /></label>{error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}<div className="flex justify-end border-t border-slate-800 pt-4"><button type="submit" disabled={!accounts.length} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"><Send size={14} aria-hidden="true" /> Review transfer</button></div></form>;
}