"use client";

import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

export default function NotificationCenter({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function markRead(id: string) {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (!response.ok) return;
      setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, isRead: true } : notification));
    } finally {
      setUpdatingId(null);
    }
  }

  return <div className="space-y-3">{notifications.length ? notifications.map((notification) => <article key={notification.id} className={`rounded-xl border p-4 ${notification.isRead ? "border-slate-800 bg-slate-900" : "border-indigo-500/20 bg-indigo-500/5"}`}><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-white">{notification.title}</h3>{!notification.isRead && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-label="Unread" />}</div><p className="mt-1 text-xs leading-5 text-slate-400">{notification.message}</p><time className="mt-3 block text-[10px] text-slate-600">{new Date(notification.createdAt).toLocaleString()}</time></div>{!notification.isRead && <button type="button" onClick={() => markRead(notification.id)} disabled={updatingId === notification.id} className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-indigo-300 hover:text-white">{updatingId === notification.id ? <LoaderCircle size={13} className="animate-spin" aria-hidden="true" /> : <Check size={13} aria-hidden="true" />} Mark read</button>}</div></article>) : <div className="rounded-2xl border border-dashed border-slate-800 px-6 py-14 text-center text-xs text-slate-500">You are all caught up.</div>}</div>;
}