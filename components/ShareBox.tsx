"use client";

import { useState } from "react";

type Props = {
  shareUrl: string;
  socialCopy: string;
};

function shareCaption(socialCopy: string): string {
  return (
    socialCopy.trim() ||
    "Fund my crypto wish on AI aGENIEnt — tap the link below."
  );
}

function buildWarpcastComposeUrl(shareUrl: string, socialCopy: string): string {
  const text = shareCaption(socialCopy);
  // Warpcast expects literal `embeds[]` keys (see Farcaster cast composer intents docs).
  return `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`;
}

function buildTwitterIntentUrl(shareUrl: string, socialCopy: string): string {
  const text = shareCaption(socialCopy);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
}

function buildTelegramShareUrl(shareUrl: string, socialCopy: string): string {
  const text = shareCaption(socialCopy);
  return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
}

export default function ShareBox({ shareUrl, socialCopy }: Props) {
  const [urlCopied, setUrlCopied] = useState(false);
  const [copyCopied, setCopyCopied] = useState(false);

  function copy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  }

  function openFarcaster() {
    const url = buildWarpcastComposeUrl(shareUrl, socialCopy);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openTelegram() {
    const url = buildTelegramShareUrl(shareUrl, socialCopy);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openTwitter() {
    const url = buildTwitterIntentUrl(shareUrl, socialCopy);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700 space-y-4">
      <h2 className="text-base font-bold text-white">📤 Share</h2>

      <div>
        <p className="text-xs text-slate-400 mb-2">Share Link</p>
        <div className="flex flex-wrap gap-2 items-stretch">
          <input
            readOnly
            value={shareUrl}
            className="min-w-0 flex-1 basis-[140px] bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={() => copy(shareUrl, setUrlCopied)}
            aria-label={urlCopied ? "Link copied" : "Copy link"}
            className="inline-flex items-center justify-center h-10 w-10 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors shrink-0"
            title={urlCopied ? "Copied!" : "Copy link"}
          >
            <CopyGlyph className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openFarcaster}
            aria-label="Share on Farcaster"
            className="inline-flex items-center justify-center h-10 w-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shrink-0 border border-indigo-400/30"
            title="Open Warpcast to post this wish"
          >
            <FarcasterGlyph className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openTelegram}
            aria-label="Share on Telegram"
            className="inline-flex items-center justify-center h-10 w-10 bg-[#229ED9] hover:bg-[#1f93cb] text-white rounded-xl transition-colors shrink-0 border border-sky-300/20"
            title="Share on Telegram"
          >
            <TelegramGlyph className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openTwitter}
            aria-label="Share on Twitter"
            className="inline-flex items-center justify-center h-10 w-10 bg-slate-100 hover:bg-white text-slate-900 rounded-xl transition-colors shrink-0 border border-slate-300/40"
            title="Share on X (Twitter)"
          >
            <TwitterXGlyph className="w-4 h-4" />
          </button>
        </div>
      </div>

      {socialCopy && (
        <div>
          <p className="text-xs text-slate-400 mb-2">AI-Generated Share Caption</p>
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
            <p className="text-sm text-slate-200 leading-relaxed">{socialCopy}</p>
          </div>
          <button
            onClick={() => copy(socialCopy, setCopyCopied)}
            className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            {copyCopied ? "✓ Caption Copied!" : "Copy Caption"}
          </button>
        </div>
      )}
    </div>
  );
}

function FarcasterGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 4 19 12 12 20 5 12 12 4z" />
    </svg>
  );
}

function CopyGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 9.75A2.25 2.25 0 0 1 11.25 7.5h7.5A2.25 2.25 0 0 1 21 9.75v9a2.25 2.25 0 0 1-2.25 2.25h-7.5A2.25 2.25 0 0 1 9 18.75v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15 7.5V5.25A2.25 2.25 0 0 0 12.75 3h-7.5A2.25 2.25 0 0 0 3 5.25v9A2.25 2.25 0 0 0 5.25 16.5H9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TelegramGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.5 5.2 3.4 11.7c-.8.3-.8 1.2.1 1.5l4.5 1.4 1.7 5.3c.2.6 1 .7 1.4.2l2.4-2.5 5.1 3.7c.6.4 1.4 0 1.6-.7l3.3-15.6c.2-1-1-1.7-1.8-1.1ZM8.3 14.1l11.4-7.1-9.8 7.4-.6 4.5-1-4.8Z" />
    </svg>
  );
}

function TwitterXGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
