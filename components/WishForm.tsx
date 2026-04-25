"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CryptoDropdown from "./CryptoDropdown";
import DateTimePicker from "./DateTimePicker";
import type { CryptoType } from "@/lib/types";

export default function WishForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cryptoType: "ETH" as CryptoType,
    targetAmount: "",
    deadline: "",
  });

  function set(field: keyof typeof form, value: string | CryptoType) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().slice(0, 16);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.deadline) {
      alert("Please select a funding deadline.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          creatorName: "Anonymous",
          targetAmount: Number(form.targetAmount),
        }),
      });
      if (!res.ok) throw new Error("Creation failed");
      const wish = await res.json();
      router.push(`/wishes/${wish.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create wish. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Wish Title <span className="text-red-400">*</span>
        </label>
        <input
          required
          placeholder="e.g. My birthday wish is 0.5 ETH"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Tell us a bit more about your wish."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Select Crypto <span className="text-red-400">*</span>
        </label>
        <CryptoDropdown
          value={form.cryptoType}
          onChange={(v) => set("cryptoType", v)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Target Amount <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            required
            type="number"
            min="0.000001"
            step="any"
            placeholder="e.g. 0.5"
            value={form.targetAmount}
            onChange={(e) => set("targetAmount", e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
            {form.cryptoType}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Funding Deadline <span className="text-red-400">*</span>
        </label>
        <DateTimePicker
          value={form.deadline}
          onChange={(iso) => set("deadline", iso)}
          min={minDateStr}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg mt-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Creating Wish...
          </span>
        ) : (
          "🌟 Make a Wish"
        )}
      </button>
    </form>
  );
}
