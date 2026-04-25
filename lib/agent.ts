import { flockChat } from "./flock";
import {
  calculateFundingProgress,
  getContributionMessages,
  getWishStatus,
} from "./tools";
import { getDeadlineStatus } from "./utils";
import type { Wish } from "./types";

const SYSTEM_PROMPT = `You are AI aGENIEnt.

You are a Crypto Wish Funding Agent that helps users register a crypto wish and enables others to fund that wish.

Your key responsibilities:
1. Understand the user's Wish information.
2. Explain the current status based on the chosen crypto, target amount, current amount, and deadline.
3. Calculate and report the current funding progress as a percentage.
4. Tell users how much is left to reach the goal.
5. Tell users how much time is left until the deadline.
6. Summarize contributor messages.
7. Generate shareable social media captions.
8. Clearly announce when the goal has been reached.

Response rules:
- Keep answers short and clear.
- Express numbers as specifically as possible.
- Always show progress as a percentage (%).
- Show crypto amounts in the unit the user selected.
- Never guarantee investment returns.
- Never assert that a specific coin will rise in price.
- Always remind users that confirmation is required before any real transaction.
- Never reveal Private Keys, API Keys, or wallet secrets.
- In this MVP, all funding is mock data — no real transactions occur.`;

export async function generateSocialCopy(wish: Wish): Promise<string> {
  const progress = calculateFundingProgress(wish.id);
  const progressPct = progress?.progress ?? 0;

  const userMsg = `Write a social media share caption (1 short paragraph, 2-3 sentences) for the following wish.
Title: ${wish.title}
Description: ${wish.description}
Crypto: ${wish.cryptoType}
Goal: ${wish.targetAmount} ${wish.cryptoType}
Current progress: ${progressPct}%
Creator: ${wish.creatorName}`;

  return flockChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMsg },
  ]);
}

export async function agentChat(
  wishId: string,
  userMessage: string
): Promise<{ reply: string; toolResult?: unknown }> {
  const status = getWishStatus(wishId);
  if (!status) {
    return { reply: "Wish not found." };
  }

  const { wish } = status;
  const funding = calculateFundingProgress(wishId);
  const deadline = getDeadlineStatus(wish.deadline);
  const messages = getContributionMessages(wishId);

  const context = `[Current Wish Status]
Title: ${wish.title}
Creator: ${wish.creatorName}
Crypto: ${wish.cryptoType}
Goal: ${wish.targetAmount} ${wish.cryptoType}
Raised: ${wish.currentAmount} ${wish.cryptoType}
Progress: ${funding?.progress ?? 0}%
Remaining: ${funding?.remaining ?? wish.targetAmount} ${wish.cryptoType}
Deadline: ${wish.deadline}
Time left: ${deadline.label}
Status: ${wish.status}
Number of contributor messages: ${messages.length}
Messages: ${messages.length > 0 ? messages.map((m, i) => `(${i + 1}) ${m}`).join(" | ") : "none"}`;

  const reply = await flockChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: context + "\n\nUser question: " + userMessage },
  ]);

  return {
    reply,
    toolResult: {
      currentAmount: wish.currentAmount,
      targetAmount: wish.targetAmount,
      progress: funding?.progress ?? 0,
      remainingAmount: funding?.remaining ?? wish.targetAmount,
      deadline: deadline.label,
      status: wish.status,
    },
  };
}
