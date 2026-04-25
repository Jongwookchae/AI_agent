/**
 * Thin wrapper around Flock.io LLM (OpenAI-compatible endpoint).
 * Authentication: x-litellm-api-key header per official Flock docs.
 */

const BASE_URL = process.env.FLOCK_BASE_URL ?? "https://api.flock.io/v1";
const API_KEY = process.env.FLOCK_API_KEY ?? "";
const MODEL =
  process.env.FLOCK_MODEL ?? "qwen3-30b-a3b-instruct-2507";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function flockChat(messages: ChatMessage[]): Promise<string> {
  if (!API_KEY) {
    return "[AI aGENIEnt] FLOCK_API_KEY is not set. Please check your .env.local file.";
  }

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "x-litellm-api-key": API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[flock] error", res.status, text);
      return fallbackResponse();
    }

    const data = await res.json();
    return (
      (data?.choices?.[0]?.message?.content as string | undefined) ??
      fallbackResponse()
    );
  } catch (err) {
    console.error("[flock] fetch error", err);
    return fallbackResponse();
  }
}

function fallbackResponse(): string {
  return "AI response is unavailable right now. Please try again shortly.";
}
