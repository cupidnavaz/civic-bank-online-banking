"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle, Plus, ShieldCheck, Trash2, X } from "lucide-react";

type Beneficiary = {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string | null;
};

type FormValues = {
  name: string;
  bankName: string;
  accountNumber: string;
  swiftCode: string;
};

const emptyForm: FormValues = {
  name: "",
  bankName: "",
  accountNumber: "",
  swiftCode: "",
};

function maskAccountNumber(accountNumber: string) {
  const compactAccount = accountNumber.replace(/\s/g, "");
  return compactAccount.length > 4
    ? `•••• ${compactAccount.slice(-4)}`
    : compactAccount;
}

export default function BeneficiaryManager({
  initialBeneficiaries,
}: {
  initialBeneficiaries: Beneficiary[];
}) {
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function closeForm() {
    setIsFormOpen(false);
    setForm(emptyForm);
    setError("");
  }

  async function addBeneficiary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to add beneficiary.");
      }

      setBeneficiaries((current) => [result.beneficiary, ...current]);
      closeForm();
      setNotice("Beneficiary added to your address book.");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to add beneficiary.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteBeneficiary(id: string) {
    if (!window.confirm("Remove this beneficiary from your address book?")) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/beneficiaries/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete beneficiary.");
      }

      setBeneficiaries((current) => current.filter((beneficiary) => beneficiary.id !== id));
      setNotice("Beneficiary removed from your address book.");
    } catch (deletionError) {
      setError(deletionError instanceof Error ? deletionError.message : "Unable to delete beneficiary.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Your saved counterparties</p>
          <p className="mt-1 text-xs text-slate-400">Only you can view or remove the beneficiaries saved to this profile.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsFormOpen(true);
            setNotice("");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
        >
          <Plus size={15} aria-hidden="true" />
          Add beneficiary
        </button>
      </div>

      {notice && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <Check size={15} aria-hidden="true" />
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          {error}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={addBeneficiary} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Add beneficiary</h3>
              <p className="mt-1 text-xs text-slate-400">Enter the recipient details exactly as registered with their bank.</p>
            </div>
            <button type="button" onClick={closeForm} aria-label="Close form" className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <X size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-400">
              Beneficiary name
              <input required maxLength={120} value={form.name} onChange={(event) => updateField("name", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="text-xs font-medium text-slate-400">
              Bank name
              <input required maxLength={120} value={form.bankName} onChange={(event) => updateField("bankName", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="text-xs font-medium text-slate-400">
              Account number / IBAN
              <input required maxLength={34} value={form.accountNumber} onChange={(event) => updateField("accountNumber", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="text-xs font-medium text-slate-400">
              SWIFT / BIC <span className="text-slate-600">(optional)</span>
              <input maxLength={11} value={form.swiftCode} onChange={(event) => updateField("swiftCode", event.target.value.toUpperCase())} className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm uppercase text-slate-200 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeForm} className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800">Cancel</button>
            <button disabled={isSaving} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving && <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />}
              {isSaving ? "Saving..." : "Save beneficiary"}
            </button>
          </div>
        </form>
      )}

      {beneficiaries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-12 text-center">
          <ShieldCheck className="mx-auto text-slate-600" size={28} aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-300">No beneficiaries saved</h3>
          <p className="mt-1 text-xs text-slate-500">Add a trusted recipient to make future transfers easier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {beneficiaries.map((beneficiary) => (
            <article key={beneficiary.id} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="truncate text-xs font-bold uppercase tracking-wide text-indigo-400">{beneficiary.bankName}</span>
                  <ShieldCheck size={15} className="shrink-0 text-emerald-400" aria-label="Saved beneficiary" />
                </div>
                <h3 className="truncate text-base font-semibold text-white">{beneficiary.name}</h3>
                <p className="mt-2 font-mono text-xs text-slate-400">Acc: {maskAccountNumber(beneficiary.accountNumber)}</p>
                <p className="font-mono text-xs text-slate-400">SWIFT: {beneficiary.swiftCode || "Not provided"}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-[10px] uppercase tracking-wide text-emerald-400">Owner verified</span>
                <button type="button" disabled={deletingId === beneficiary.id} onClick={() => deleteBeneficiary(beneficiary.id)} className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50">
                  {deletingId === beneficiary.id ? <LoaderCircle size={13} className="animate-spin" aria-hidden="true" /> : <Trash2 size={13} aria-hidden="true" />}
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}