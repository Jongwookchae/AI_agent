"use client";

import type { CryptoType } from "@/lib/types";

const OPTIONS: { value: CryptoType; label: string; icon: string }[] = [
  { value: "ETH", label: "Ethereum (ETH)", icon: "Ξ" },
  { value: "SOL", label: "Solana (SOL)", icon: "◎" },
  { value: "BTC", label: "Bitcoin (BTC)", icon: "₿" },
  { value: "BASE", label: "Base (ETH)", icon: "🔵" },
];

type Props = {
  value: CryptoType;
  onChange: (v: CryptoType) => void;
};

export default function CryptoDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CryptoType)}
      className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.icon} {o.label}
        </option>
      ))}
    </select>
  );
}
