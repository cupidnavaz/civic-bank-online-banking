"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Row = { id: string; name: string; status: string; detail?: string };

export default function AdminCrudTable({ title, rows, onAddLabel = "Add record" }: { title: string; rows: Row[]; onAddLabel?: string }) {
  const [items, setItems] = useState(rows);
  const [name, setName] = useState("");
  function add() { if (!name.trim()) return; setItems((current) => [...current, { id: `local-${Date.now()}`, name: name.trim(), status: "ACTIVE" }]); setName(""); }
  function remove(id: string) { setItems((current) => current.filter((item) => item.id !== id)); }
  return <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl"><div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-sm font-semibold text-white">{title}</h2><div className="flex gap-2"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New record name" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white sm:w-56" /><button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white"><Plus size={13} />{onAddLabel}</button></div></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500"><th className="px-5 py-3">Product</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-800">{items.map((item) => <tr key={item.id} className="text-xs text-slate-300 hover:bg-slate-800/40"><td className="px-5 py-4"><p className="font-semibold text-white">{item.name}</p><p className="mt-1 text-slate-500">{item.detail || item.id}</p></td><td className="px-5 py-4"><span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">{item.status}</span></td><td className="px-5 py-4 text-right"><button type="button" className="mr-3 inline-flex items-center gap-1 text-indigo-300"><Pencil size={13} /> Edit</button><button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1 text-red-300"><Trash2 size={13} /> Delete</button></td></tr>)}</tbody></table></div></section>;
}
