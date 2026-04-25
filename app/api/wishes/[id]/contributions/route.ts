import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/lib/storage";
import { calculateProgress } from "@/lib/utils";
import type { Contribution } from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wish = storage.getWish(id);

  if (!wish) {
    return NextResponse.json({ error: "Wish not found." }, { status: 404 });
  }

  if (wish.status !== "active") {
    return NextResponse.json(
      { error: "This wish is no longer accepting funding." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { contributorName, amount, message, txHash } = body;

  if (!contributorName || !amount) {
    return NextResponse.json({ error: "Contributor name and amount are required." }, { status: 400 });
  }

  const contribution: Contribution = {
    id: uuidv4(),
    wishId: id,
    contributorName,
    amount: Number(amount),
    message: message ?? "",
    txHash: typeof txHash === "string" ? txHash : undefined,
    createdAt: new Date().toISOString(),
  };

  storage.addContribution(contribution);

  const newAmount = Number(
    (wish.currentAmount + contribution.amount).toFixed(8)
  );
  const isCompleted = newAmount >= wish.targetAmount;

  const updatedWish = storage.updateWish(id, {
    currentAmount: newAmount,
    status: isCompleted ? "completed" : "active",
  });

  const progress = calculateProgress(newAmount, wish.targetAmount);

  return NextResponse.json({ contribution, wish: updatedWish, progress }, { status: 201 });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contributions = storage.getContributions(id);
  return NextResponse.json(contributions);
}
