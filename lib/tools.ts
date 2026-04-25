import { storage } from "./storage";
import { calculateProgress, getDeadlineStatus } from "./utils";

export type AgentTool =
  | "generateSocialCopy"
  | "getWishStatus"
  | "calculateFundingProgress"
  | "getDeadlineStatus"
  | "summarizeMessages"
  | "createShareLink";

export function getWishStatus(wishId: string) {
  const wish = storage.getWish(wishId);
  if (!wish) return null;
  const progress = calculateProgress(wish.currentAmount, wish.targetAmount);
  const deadline = getDeadlineStatus(wish.deadline);
  return { wish, progress, deadline };
}

export function calculateFundingProgress(wishId: string) {
  const wish = storage.getWish(wishId);
  if (!wish) return null;
  const progress = calculateProgress(wish.currentAmount, wish.targetAmount);
  const remaining = Math.max(0, wish.targetAmount - wish.currentAmount);
  return {
    currentAmount: wish.currentAmount,
    targetAmount: wish.targetAmount,
    cryptoType: wish.cryptoType,
    progress,
    remaining: Number(remaining.toFixed(8)),
  };
}

export function getContributionMessages(wishId: string): string[] {
  return storage.getContributions(wishId).map((c) => c.message).filter(Boolean);
}

export function createShareLink(wishId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/wishes/${wishId}`;
}
