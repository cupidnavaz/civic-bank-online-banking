"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { m: "Apr", v: 4.2 },
  { m: "May", v: 4.8 },
  { m: "Jun", v: 5.1 },
  { m: "Jul", v: 6.0 },
  { m: "Aug", v: 7.2 },
  { m: "Sep", v: 8.4 },
];

export default function BalanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="m" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }}
        />
        <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}