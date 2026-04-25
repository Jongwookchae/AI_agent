/**
 * In-memory mock storage.
 * Replace with Supabase / DB in production.
 */
import type { Wish, Contribution } from "./types";

const wishes = new Map<string, Wish>();
const contributions = new Map<string, Contribution[]>();

export const storage = {
  // --- Wish ---
  createWish(wish: Wish): Wish {
    wishes.set(wish.id, wish);
    contributions.set(wish.id, []);
    return wish;
  },

  getWish(id: string): Wish | undefined {
    return wishes.get(id);
  },

  updateWish(id: string, patch: Partial<Wish>): Wish | undefined {
    const wish = wishes.get(id);
    if (!wish) return undefined;
    const updated = { ...wish, ...patch, updatedAt: new Date().toISOString() };
    wishes.set(id, updated);
    return updated;
  },

  listWishes(): Wish[] {
    return Array.from(wishes.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // --- Contribution ---
  addContribution(contribution: Contribution): Contribution {
    const list = contributions.get(contribution.wishId) ?? [];
    list.push(contribution);
    contributions.set(contribution.wishId, list);
    return contribution;
  },

  getContributions(wishId: string): Contribution[] {
    return contributions.get(wishId) ?? [];
  },
};
