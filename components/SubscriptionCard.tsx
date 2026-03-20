"use client";

import { format } from "date-fns";
import { AlertTriangle, ExternalLink, Scissors } from "lucide-react";
import type { Subscription } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  productivity: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  fitness: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  food: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  other: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function getClearbitLogo(serviceName: string): string {
  const domainMap: Record<string, string> = {
    netflix: "netflix.com",
    spotify: "spotify.com",
    youtube: "youtube.com",
    "youtube premium": "youtube.com",
    "amazon prime": "amazon.com",
    amazon: "amazon.com",
    hotstar: "hotstar.com",
    disney: "hotstar.com",
    notion: "notion.so",
    chatgpt: "openai.com",
    openai: "openai.com",
    github: "github.com",
    "github copilot": "github.com",
    copilot: "github.com",
    figma: "figma.com",
    adobe: "adobe.com",
    canva: "canva.com",
    slack: "slack.com",
    zoom: "zoom.us",
    swiggy: "swiggy.com",
    zomato: "zomato.com",
    "cult.fit": "cultfit.com",
    cultfit: "cultfit.com",
    apple: "apple.com",
    icloud: "apple.com",
    microsoft: "microsoft.com",
    linkedin: "linkedin.com",
    "google one": "google.com",
    jiocinema: "jiocinema.com",
    blinkit: "blinkit.com",
  };
  const key = serviceName.toLowerCase();
  for (const [name, domain] of Object.entries(domainMap)) {
    if (key.includes(name)) return `https://logo.clearbit.com/${domain}`;
  }
  return `https://logo.clearbit.com/${key.replace(/\s+/g, "")}.com`;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  markedForCancel: boolean;
  onToggleCancel: (id: string) => void;
  onGenerateLetter: (sub: Subscription) => void;
}

export default function SubscriptionCard({
  subscription: sub,
  markedForCancel,
  onToggleCancel,
  onGenerateLetter,
}: SubscriptionCardProps) {
  const categoryStyle = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.other;
  const logoUrl = getClearbitLogo(sub.service_name);

  const formattedDate = sub.last_charged
    ? (() => {
        try {
          return format(new Date(sub.last_charged), "dd MMM yyyy");
        } catch {
          return sub.last_charged;
        }
      })()
    : "—";

  const cycleLabel =
    sub.billing_cycle === "yearly"
      ? "/yr"
      : sub.billing_cycle === "weekly"
        ? "/wk"
        : "/mo";

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        sub.is_forgotten
          ? "border-[#ff4444]/20 bg-[#111111] shadow-[-4px_0_12px_-4px_rgba(255,68,68,0.15)]"
          : "border-[#1a1a1a] bg-[#111111] hover:border-[#2a2a2a]"
      } ${markedForCancel ? "ring-1 ring-[#00ff88]/30" : ""}`}
    >
      <div className="flex items-start gap-3 p-3 sm:items-center sm:gap-4 sm:p-4">
        {/* Logo */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={sub.service_name}
            className="h-6 w-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `<span class="text-xs font-bold text-zinc-500">${sub.service_name.charAt(0).toUpperCase()}</span>`;
            }}
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 className="truncate text-sm font-semibold text-white">
              {sub.service_name}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${categoryStyle}`}
            >
              {sub.category}
            </span>
            {sub.is_forgotten && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#ff4444]/10 px-2 py-0.5 text-[10px] font-medium text-[#ff4444]">
                <AlertTriangle className="h-2.5 w-2.5" />
                Forgotten
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#888888]">
            <span>Charged {sub.times_charged}x</span>
            <span className="hidden text-[#333] sm:inline">•</span>
            <span className="hidden sm:inline">Last: {formattedDate}</span>
            {sub.cancel_url && (
              <>
                <span className="hidden text-[#333] sm:inline">•</span>
                <a
                  href={sub.cancel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[#00ff88]/60 transition-colors hover:text-[#00ff88]"
                >
                  Cancel link
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </>
            )}
          </div>

          {/* Mobile: cancel button row */}
          <div className="mt-2 flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => onGenerateLetter(sub)}
              className="flex h-7 items-center gap-1 rounded-md border border-[#1a1a1a] px-2 text-[10px] text-[#888888] transition-all hover:border-[#ff4444]/30 hover:text-[#ff4444]"
            >
              <Scissors className="h-2.5 w-2.5" />
              Cancel
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop: generate letter button */}
          <button
            type="button"
            onClick={() => onGenerateLetter(sub)}
            className="hidden h-8 items-center gap-1.5 rounded-lg border border-[#1a1a1a] bg-transparent px-3 text-xs text-[#888888] opacity-0 transition-all hover:border-[#ff4444]/30 hover:text-[#ff4444] group-hover:opacity-100 sm:flex"
          >
            <Scissors className="h-3 w-3" />
            Cancel
          </button>

          {/* Amount */}
          <div className="text-right">
            <p className="text-sm font-bold tabular-nums text-white">
              ₹{sub.amount.toLocaleString("en-IN")}
              <span className="ml-0.5 text-xs font-normal text-[#888888]">
                {cycleLabel}
              </span>
            </p>
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => onToggleCancel(sub.id)}
            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
              markedForCancel ? "bg-[#00ff88]" : "bg-[#2a2a2a]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                markedForCancel ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
