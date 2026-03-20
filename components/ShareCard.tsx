"use client";

import { useRef, useState, useCallback } from "react";
import { Download, Share2, Check, Slash } from "lucide-react";

interface ShareCardProps {
  totalBurn: number;
  savings: number;
  subsCount: number;
}

export default function ShareCard({
  totalBurn,
  savings,
  subsCount,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [shared, setShared] = useState(false);

  const captureCard = useCallback(async () => {
    if (!cardRef.current) return null;
    const html2canvas = (await import("html2canvas-pro")).default;
    return html2canvas(cardRef.current, {
      backgroundColor: "#0a0a0a",
      scale: 2,
    });
  }, []);

  const handleDownload = useCallback(async () => {
    setSaving(true);
    try {
      const canvas = await captureCard();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "subslash-audit.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setSaving(false);
    }
  }, [captureCard]);

  const handleShare = useCallback(async () => {
    try {
      const canvas = await captureCard();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share) {
          const file = new File([blob], "subslash-audit.png", {
            type: "image/png",
          });
          await navigator.share({
            title: "My SubSlash Audit",
            text: `I found ₹${savings.toLocaleString("en-IN")} wasted on forgotten subscriptions! 💸`,
            files: [file],
          });
        } else {
          await navigator.clipboard.writeText(
            `I found ₹${savings.toLocaleString("en-IN")} wasted on ${subsCount} forgotten subscriptions! Audited with SubSlash 💸`
          );
          setShared(true);
          setTimeout(() => setShared(false), 2000);
        }
      }, "image/png");
    } catch {
      // User cancelled share
    }
  }, [captureCard, savings, subsCount]);

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[#888888]">
        Share Your Audit
      </h3>

      {/* Shareable card */}
      <div
        ref={cardRef}
        className="overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00ff88]/10">
            <Slash className="h-3 w-3 text-[#00ff88]" />
          </div>
          <span className="text-sm font-semibold text-white">
            Sub<span className="text-[#00ff88]">Slash</span>
          </span>
        </div>

        <p className="text-xs uppercase tracking-wider text-[#888888]">
          I found
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums text-[#00ff88]">
          ₹{savings.toLocaleString("en-IN")}
          <span className="text-lg text-[#888888]">/mo</span>
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          wasted on forgotten subscriptions
        </p>

        <div className="mt-6 flex gap-6 border-t border-[#1a1a1a] pt-4">
          <div>
            <p className="text-lg font-bold tabular-nums text-white">
              {subsCount}
            </p>
            <p className="text-[10px] text-[#888888]">subscriptions</p>
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-[#ff4444]">
              ₹{totalBurn.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-[#888888]">monthly burn</p>
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-[#00ff88]">
              ₹{(savings * 12).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-[#888888]">yearly savings</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#1a1a1a] bg-transparent px-4 py-2.5 text-sm text-white transition-colors hover:border-[#2a2a2a]"
        >
          <Download className="h-4 w-4" />
          Save Image
        </button>
        <button
          type="button"
          onClick={handleShare}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            shared
              ? "bg-[#00ff88]/10 text-[#00ff88]"
              : "bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
          }`}
        >
          {shared ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share
            </>
          )}
        </button>
      </div>
    </div>
  );
}
