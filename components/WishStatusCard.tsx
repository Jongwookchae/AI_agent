import ProgressBar from "./ProgressBar";
import { cryptoIcon, cryptoLabel } from "@/lib/utils";
import type { Wish } from "@/lib/types";

type Props = {
  wish: Wish;
  progress: number;
  deadlineLabel: string;
  deadlineExpired: boolean;
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  completed: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  expired: "bg-red-500/20 text-red-400 border border-red-500/30",
  cancelled: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  draft: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Funding Active",
  completed: "🎉 Goal Reached!",
  expired: "Expired",
  cancelled: "Cancelled",
  draft: "Draft",
};

export default function WishStatusCard({
  wish,
  progress,
  deadlineLabel,
  deadlineExpired,
}: Props) {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">{wish.title}</h1>
          <p className="text-slate-400 text-sm mt-1">by {wish.creatorName}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_BADGE[wish.status] ?? ""}`}
        >
          {STATUS_LABEL[wish.status] ?? wish.status}
        </span>
      </div>

      {wish.description && (
        <p className="text-slate-300 text-sm leading-relaxed">{wish.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Crypto</p>
          <p className="text-lg font-bold text-white">
            {cryptoIcon(wish.cryptoType)} {cryptoLabel(wish.cryptoType)}
          </p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Target Amount</p>
          <p className="text-lg font-bold text-white">
            {wish.targetAmount} {wish.cryptoType}
          </p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Raised So Far</p>
          <p className="text-lg font-bold text-violet-300">
            {wish.currentAmount} {wish.cryptoType}
          </p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Time Left</p>
          <p
            className={`text-sm font-semibold ${deadlineExpired ? "text-red-400" : "text-yellow-300"}`}
          >
            {deadlineLabel}
          </p>
        </div>
      </div>

      <ProgressBar progress={progress} />
    </div>
  );
}
