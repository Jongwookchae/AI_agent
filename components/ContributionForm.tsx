"use client";

import { useState } from "react";
import type { CryptoType } from "@/lib/types";

type Props = {
  wishId: string;
  cryptoType: CryptoType;
  wishStatus: string;
  onSuccess: () => void;
};

export default function ContributionForm({
  wishId,
  cryptoType,
  wishStatus,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contributorName: "",
    amount: "",
    message: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const disabled = wishStatus !== "active";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/wishes/${wishId}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? "Failed to submit funding.");
        return;
      }
      setForm({ contributorName: "", amount: "", message: "" });
      onSuccess();
    } catch {
      alert("Failed to submit funding.");
    } finally {
      setLoading(false);
    }
  }

  if (disabled) {
    return (
      <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
        <p className="text-slate-400 text-center text-sm py-2">
          {wishStatus === "completed"
            ? "🎉 Goal reached! Funding is now closed."
            : "This wish is not currently accepting funding."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700 space-y-4"
    >
      <h2 className="text-base font-bold text-white">💝 Fund This Wish</h2>
      <p className="text-xs text-slate-400">
        * MVP — all contributions are mock data. No real transactions occur.
      </p>

      <div>
        <label className="block text-sm text-slate-300 mb-1">
          Name / Nickname <span className="text-red-400">*</span>
        </label>
        <input
          required
          placeholder="e.g. Mina"
          value={form.contributorName}
          onChange={(e) => set("contributorName", e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-1">
          Amount <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            required
            type="number"
            min="0.000001"
            step="any"
            placeholder="e.g. 0.1"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
            {cryptoType}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-1">Congratulations Message</label>
        <textarea
          rows={2}
          placeholder="Leave a cheerful message!"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
            Processing...
          </span>
        ) : (
          "🎁 Fund This Wish"
        )}
      </button>
    </form>
  );
}
