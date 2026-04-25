import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/lib/storage";
import { generateSocialCopy } from "@/lib/agent";
import { createShareLink } from "@/lib/tools";
import type { CryptoType, Wish } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { creatorName, title, description, cryptoType, targetAmount, deadline } = body;

    if (!creatorName || !title || !cryptoType || !targetAmount || !deadline) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const wish: Wish = {
      id,
      creatorName,
      title,
      description: description ?? "",
      cryptoType: cryptoType as CryptoType,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      deadline,
      shareUrl: createShareLink(id),
      socialCopy: "",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    storage.createWish(wish);

    // Generate social copy via Flock LLM (non-blocking on error)
    const socialCopy = await generateSocialCopy(wish).catch(() => "");
    storage.updateWish(id, { socialCopy });

    const created = storage.getWish(id)!;
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/wishes]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  const list = storage.listWishes();
  return NextResponse.json(list);
}
