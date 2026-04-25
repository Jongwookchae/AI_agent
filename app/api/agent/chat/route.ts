import { NextResponse } from "next/server";
import { agentChat } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const { wishId, message } = await req.json();

    if (!wishId || !message) {
      return NextResponse.json(
        { error: "wishId and message are required." },
        { status: 400 }
      );
    }

    const result = await agentChat(wishId, message);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/agent/chat]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
