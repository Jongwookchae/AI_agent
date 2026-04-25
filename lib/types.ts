export type CryptoType = "SOL" | "BTC" | "BASE" | "ETH";

export type WishStatus =
  | "draft"
  | "active"
  | "completed"
  | "expired"
  | "cancelled";

export type Wish = {
  id: string;
  creatorName: string;
  title: string;
  description: string;
  cryptoType: CryptoType;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  shareUrl: string;
  socialCopy: string;
  status: WishStatus;
  createdAt: string;
  updatedAt: string;
};

export type Contribution = {
  id: string;
  wishId: string;
  contributorName: string;
  amount: number;
  message: string;
  txHash?: string;
  createdAt: string;
};

export type AgentMessage = {
  id: string;
  wishId: string;
  role: "user" | "assistant" | "tool";
  content: string;
  createdAt: string;
};
