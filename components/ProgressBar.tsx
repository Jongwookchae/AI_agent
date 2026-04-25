"use client";

type Props = {
  progress: number; // 0–100
};

export default function ProgressBar({ progress }: Props) {
  const pct = Math.min(100, Math.max(0, progress));
  const color =
    pct >= 100 ? "bg-emerald-500" : pct >= 50 ? "bg-violet-500" : "bg-violet-400";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Progress</span>
        <span className="font-semibold text-white">{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
