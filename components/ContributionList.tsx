import type { Contribution } from "@/lib/types";

type Props = {
  contributions: Contribution[];
  cryptoType: string;
};

export default function ContributionList({ contributions, cryptoType }: Props) {
  if (contributions.length === 0) {
    return (
      <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
        <h2 className="text-base font-bold text-white mb-3">💌 Messages</h2>
        <p className="text-slate-500 text-sm text-center py-4">
          No contributions yet. Be the first to fund this wish!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
      <h2 className="text-base font-bold text-white mb-3">
        💌 Messages{" "}
        <span className="text-violet-400 text-sm font-normal">
          ({contributions.length})
        </span>
      </h2>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {[...contributions].reverse().map((c) => (
          <div
            key={c.id}
            className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white text-sm">{c.contributorName}</span>
              <span className="text-violet-400 text-sm font-bold">
                +{c.amount} {cryptoType}
              </span>
            </div>
            {c.message && (
              <p className="text-slate-300 text-sm leading-relaxed">{c.message}</p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              {new Date(c.createdAt).toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
