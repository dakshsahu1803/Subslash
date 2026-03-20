"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  Mail,
} from "lucide-react";
import type { Subscription } from "@/types";

interface CancelModalProps {
  subscription: Subscription;
  onClose: () => void;
  onMarkCancelled: (id: string) => void;
}

export default function CancelModal({
  subscription: sub,
  onClose,
  onMarkCancelled,
}: CancelModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState<"subject" | "body" | "all" | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function generateLetter() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_name: sub.service_name,
            amount: sub.amount,
            billing_cycle: sub.billing_cycle,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to generate letter");
        }

        const data = await res.json();
        setSubject(data.subject);
        setBody(data.body);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate letter"
        );
      } finally {
        setLoading(false);
      }
    }

    generateLetter();
  }, [sub]);

  const copyToClipboard = useCallback(
    async (type: "subject" | "body" | "all") => {
      const text =
        type === "subject"
          ? subject
          : type === "body"
            ? body
            : `Subject: ${subject}\n\n${body}`;

      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    },
    [subject, body]
  );

  const handleMarkCancelled = useCallback(() => {
    setCancelled(true);
    onMarkCancelled(sub.id);
    setTimeout(onClose, 1200);
  }, [sub.id, onMarkCancelled, onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0f0f0f] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4444]/10">
              <Mail className="h-4 w-4 text-[#ff4444]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Cancel {sub.service_name}
              </h2>
              <p className="text-xs text-[#888888]">
                ₹{sub.amount.toLocaleString("en-IN")}/{sub.billing_cycle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#888888] transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#00ff88]" />
              <p className="text-sm text-[#888888]">
                Generating cancellation letter…
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-[#ff4444]/20 bg-[#ff4444]/5 p-4 text-center">
              <p className="text-sm text-[#ff4444]">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-300 hover:border-white/20"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Subject */}
              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-[#888888]">
                    Subject
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("subject")}
                    className="flex items-center gap-1 text-[10px] text-[#00ff88]/60 transition-colors hover:text-[#00ff88]"
                  >
                    {copied === "subject" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied === "subject" ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="rounded-lg border border-[#1a1a1a] bg-[#111111] px-4 py-3 text-sm text-white">
                  {subject}
                </div>
              </div>

              {/* Body */}
              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-[#888888]">
                    Email Body
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("body")}
                    className="flex items-center gap-1 text-[10px] text-[#00ff88]/60 transition-colors hover:text-[#00ff88]"
                  >
                    {copied === "body" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied === "body" ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="rounded-lg border border-[#1a1a1a] bg-[#111111] px-4 py-3 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {body}
                </div>
              </div>

              {/* Copy All */}
              <button
                type="button"
                onClick={() => copyToClipboard("all")}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  copied === "all"
                    ? "border-[#00ff88]/30 bg-[#00ff88]/10 text-[#00ff88]"
                    : "border-[#1a1a1a] bg-[#111111] text-white hover:border-[#2a2a2a]"
                }`}
              >
                {copied === "all" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied === "all"
                  ? "Copied to clipboard!"
                  : "Copy Full Email"}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="flex flex-col gap-3 border-t border-[#1a1a1a] px-6 py-4">
            {/* Cancel URL */}
            {sub.cancel_url && (
              <a
                href={sub.cancel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#ff4444]/20 bg-[#ff4444]/5 px-4 py-2.5 text-sm font-medium text-[#ff4444] transition-all hover:bg-[#ff4444]/10"
              >
                <ExternalLink className="h-4 w-4" />
                Go to {sub.service_name} Cancellation Page
              </a>
            )}

            {/* Mark as Cancelled */}
            <button
              type="button"
              onClick={handleMarkCancelled}
              disabled={cancelled}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                cancelled
                  ? "bg-[#00ff88]/10 text-[#00ff88]"
                  : "bg-[#00ff88] text-black hover:bg-[#00ff88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              }`}
            >
              {cancelled ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Marked as Cancelled
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Cancelled
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
