"use client";

import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    if (result?.error) {
      setError("Invalid administrator credentials.");
      setLoading(false);
      return;
    }
    const session = await getSession();
    if ((session?.user as any)?.role !== "ADMIN") {
      await signOut({ redirect: false });
      setError("This account does not have administrator access.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-slate-100"><div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-8 shadow-2xl"><div className="mb-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-lg font-black text-white">C</div><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">Restricted access</p><h1 className="mt-2 text-2xl font-semibold text-white">Administrator sign in</h1><p className="mt-2 text-xs text-slate-400">Use an account with the ADMIN role to access operations.</p></div>{error && <p role="alert" className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}<form onSubmit={submit} className="space-y-4"><label className="block text-xs font-medium text-slate-400">Administrator email<input name="email" type="email" required autoComplete="email" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-400" /></label><label className="block text-xs font-medium text-slate-400">Password<input name="password" type="password" required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-400" /></label><button disabled={loading} className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60">{loading ? "Verifying..." : "Enter admin dashboard"}</button></form><Link href="/login" className="mt-6 block text-center text-xs text-indigo-400 hover:text-indigo-300">Customer sign in</Link></div></main>;
}