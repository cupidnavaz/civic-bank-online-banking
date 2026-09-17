"use client";

import { useState } from "react";
import { Bitcoin, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Account = { id: string; currency: string; balance: number };

export default function CryptoPurchaseForm({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const usdAccounts = accounts.filter((account) => account.currency === "USD");
  const [asset, setAsset] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(usdAccounts[0]?.id || "");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function purchase() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/crypto/purchase", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ asset, amount: Number(amount), accountId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to complete purchase.");
      setStatus(`Purchase complete. Reference ${data.reference}.`);
      setAmount("");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to complete purchase.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"><div className="flex items-start gap-3 border-b border-slate-800 pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400"><Bitcoin size={17} aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-white">Buy digital assets</h2><p className="mt-1 text-xs text-slate-400">Demo market prices only. Purchases debit an owned USD account.</p></div></div>{usdAccounts.length ? <><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"><label className="text-xs font-medium text-slate-400">Asset<select value={asset} onChange={(event) => setAsset(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500"><option>BTC</option><option>ETH</option><option>USDC</option></select></label><label className="text-xs font-medium text-slate-400">USD amount<input required min="1" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="100.00" className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-200 outline-none focus:border-indigo-500" /></label><label className="text-xs font-medium text-slate-400">Funding account<select value={accountId} onChange={(event) => setAccountId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500">{usdAccounts.map((account) => <option key={account.id} value={account.id}>USD · ${Number(account.balance).toLocaleString()}</option>)}</select></label></div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p role="status" className="text-xs text-slate-400">{status}</p><button type="button" onClick={purchase} disabled={loading || !amount} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">{loading ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <Bitcoin size={14} aria-hidden="true" />}{loading ? "Buying..." : "Buy asset"}</button></div></> : <p className="mt-5 rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-xs text-slate-500">Open a USD account before buying digital assets.</p>}</div>;
}