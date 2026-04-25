import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { calculateProgress, getDeadlineStatus } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wish = storage.getWish(id);

  if (!wish) {
    return NextResponse.json({ error: "Wish not found." }, { status: 404 });
  }

  const contributions = storage.getContributions(id);
  const progress = calculateProgress(wish.currentAmount, wish.targetAmount);
  const deadlineStatus = getDeadlineStatus(wish.deadline);

  return NextResponse.json({ wish, progress, deadlineStatus, contributions });
}
