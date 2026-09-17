"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Check, ChevronRight } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
};

export default function DashboardAlerts({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  async function markRead(id: string) {
    const response = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    if (!response.ok) return;
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, isRead: true } : notification));
  }

  return <div className="relative"><button type="button" aria-label={`${unreadCount} unread notifications`} onClick={() => setOpen((current) => !current)} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-indigo-500/40 hover:text-white"><Bell size={17} aria-hidden="true" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>{open && <div className="absolute right-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"><div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div><p className="text-xs font-semibold text-white">Notifications</p><p className="mt-0.5 text-[10px] text-slate-500">{unreadCount ? `${unreadCount} unread alert${unreadCount === 1 ? "" : "s"}` : "All caught up"}</p></div><Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300">View all</Link></div><div className="max-h-80 overflow-y-auto">{notifications.length ? notifications.slice(0, 5).map((notification) => <div key={notification.id} className={`border-b border-slate-800 px-4 py-3 last:border-0 ${notification.isRead ? "" : "bg-indigo-500/5"}`}><div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-slate-700" : "bg-indigo-400"}`} /><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-200">{notification.title}</p><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">{notification.message}</p><p className="mt-2 text-[10px] text-slate-600">{new Date(notification.createdAt).toLocaleString()}</p></div>{!notification.isRead && <button type="button" aria-label="Mark notification as read" onClick={() => markRead(notification.id)} className="shrink-0 text-indigo-400 hover:text-white"><Check size={14} aria-hidden="true" /></button>}</div></div>) : <p className="px-4 py-10 text-center text-xs text-slate-500">No notifications yet.</p>}</div><Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-[11px] font-semibold text-slate-400 hover:text-white">Open notification center <ChevronRight size={14} aria-hidden="true" /></Link></div>}</div>;
}