import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateProgress(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount <= 0) return 0;
  const progress = (currentAmount / targetAmount) * 100;
  return Math.min(Number(progress.toFixed(2)), 100);
}

export function getDeadlineStatus(deadline: string): {
  expired: boolean;
  label: string;
} {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { expired: true, label: "Deadline passed." };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffHours / 24);
  const hours = diffHours % 24;

  if (days === 0) {
    return { expired: false, label: `${hours}h remaining` };
  }
  return { expired: false, label: `${days}d ${hours}h remaining` };
}

export function cryptoLabel(type: string): string {
  const labels: Record<string, string> = {
    SOL: "Solana",
    BTC: "Bitcoin",
    BASE: "Base",
    ETH: "Ethereum",
  };
  return labels[type] ?? type;
}

export function cryptoIcon(type: string): string {
  const icons: Record<string, string> = {
    SOL: "◎",
    BTC: "₿",
    BASE: "🔵",
    ETH: "Ξ",
  };
  return icons[type] ?? "◆";
}
