"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MonthlyPoint = { label: string; income: number; outgoing: number };
type AllocationPoint = { name: string; value: number; color: string };

export default function DashboardAnalytics({ monthly, allocation }: { monthly: MonthlyPoint[]; allocation: AllocationPoint[] }) {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Cash flow overview</h2>
            <p className="mt-1 text-xs text-slate-400">Incoming and outgoing activity over the last six months.</p>
          </div>
          <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">USD view</span>
        </div>
        <div className="mt-5 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} barGap={6}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip cursor={{ fill: "#1e293b" }} contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", color: "#fff", fontSize: 12 }} formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, ""]} />
              <Bar dataKey="income" name="Incoming" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" name="Outgoing" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-5 text-[10px] text-slate-400"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Incoming</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-indigo-400" /> Outgoing</span></div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
        <div className="border-b border-slate-800 pb-4"><h2 className="text-sm font-semibold text-white">Balance allocation</h2><p className="mt-1 text-xs text-slate-400">How your current balance is distributed.</p></div>
        <div className="mt-4 h-48">
          {allocation.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={allocation} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>{allocation.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", color: "#fff", fontSize: 12 }} formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, "Balance"]} /></PieChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-xs text-slate-500">No balance data available.</div>}
        </div>
        <div className="space-y-2">{allocation.map((entry) => <div key={entry.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-400"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />{entry.name}</span><span className="font-mono text-slate-200">${entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>)}</div>
      </div>
    </section>
  );
}