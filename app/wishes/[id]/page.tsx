"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import WishStatusCard from "@/components/WishStatusCard";
import ShareBox from "@/components/ShareBox";
import ContributionForm from "@/components/ContributionForm";
import ContributionList from "@/components/ContributionList";
import AgentChat from "@/components/AgentChat";
import type { Wish, Contribution } from "@/lib/types";

type WishData = {
  wish: Wish;
  progress: number;
  deadlineStatus: { expired: boolean; label: string };
  contributions: Contribution[];
};

export default function WishDetailPage() {
  const params = useParams<{ id: string }>();
  const wishId = params?.id ?? "";

  const [data, setData] = useState<WishData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/wishes/${wishId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Wish not found.");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [wishId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-5xl">😔</span>
        <p className="text-slate-300 font-semibold">{error ?? "Wish not found."}</p>
        <a
          href="/"
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  const { wish, progress, deadlineStatus, contributions } = data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Back */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        ← Home
      </a>

      {/* Status card */}
      <WishStatusCard
        wish={wish}
        progress={progress}
        deadlineLabel={deadlineStatus.label}
        deadlineExpired={deadlineStatus.expired}
      />

      {/* Share box */}
      <ShareBox shareUrl={wish.shareUrl} socialCopy={wish.socialCopy} />

      {/* Funding form */}
      <ContributionForm
        wishId={wishId}
        cryptoType={wish.cryptoType}
        wishStatus={wish.status}
        onSuccess={fetchData}
      />

      {/* Contribution list */}
      <ContributionList contributions={contributions} cryptoType={wish.cryptoType} />

      {/* Agent Chat */}
      <AgentChat wishId={wishId} />
    </div>
  );
}
