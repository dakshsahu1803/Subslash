"use client";

import { Lightbulb, AlertTriangle, Scissors, ArrowRight } from "lucide-react";
import type { Recommendation, Subscription } from "@/types";

interface SavingsAdvisorProps {
  recommendations: Recommendation[];
  subscriptions: Subscription[];
  summary: string;
  onGenerateCancelLetters: () => void;
}

export default function SavingsAdvisor({
  recommendations,
  subscriptions,
  summary,
  onGenerateCancelLetters,
}: SavingsAdvisorProps) {
  // Detect duplicate categories (e.g., two entertainment/music services)
  const categoryGroups = new Map<string, Subscription[]>();
  for (const sub of subscriptions) {
    const list = categoryGroups.get(sub.category) || [];
    list.push(sub);
    categoryGroups.set(sub.category, list);
  }

  const duplicates = Array.from(categoryGroups.entries())
    .filter(([, subs]) => subs.length >= 2)
    .map(([category, subs]) => ({
      category,
      services: subs.map((s) => s.service_name),
      totalMonthly: subs.reduce((sum, s) => {
        if (s.billing_cycle === "yearly") return sum + s.amount / 12;
        if (s.billing_cycle === "weekly") return sum + s.amount * 4;
        return sum + s.amount;
      }, 0),
    }));

  const topRecs = recommendations.slice(0, 3);
  const hasActions = topRecs.length > 0 || duplicates.length > 0;

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#111111]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#1a1a1a] px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/10">
          <Lightbulb className="h-4 w-4 text-[#00ff88]" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">
            AI Recommendations
          </h2>
          <p className="text-xs text-[#888888]">{summary}</p>
        </div>
      </div>

      <div className="divide-y divide-[#1a1a1a]">
        {/* Top cancellation recommendations */}
        {topRecs.map((rec, i) => (
          <div
            key={`${rec.service_name}-${i}`}
            className="flex items-center gap-4 px-6 py-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff4444]/10 text-sm font-bold text-[#ff4444]">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Cancel{" "}
                <span className="text-[#ff4444]">{rec.service_name}</span>
              </p>
              <p className="mt-0.5 text-xs text-[#888888]">{rec.reason}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold tabular-nums text-[#00ff88]">
                +₹{Math.round(rec.estimated_savings).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-[#888888]">saved/mo</p>
            </div>
          </div>
        ))}

        {/* Duplicate warnings */}
        {duplicates.map((dup) => (
          <div
            key={dup.category}
            className="flex items-center gap-4 px-6 py-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Duplicate{" "}
                <span className="capitalize text-yellow-400">
                  {dup.category}
                </span>{" "}
                services
              </p>
              <p className="mt-0.5 text-xs text-[#888888]">
                {dup.services.join(", ")} — consider keeping only one (₹
                {Math.round(dup.totalMonthly).toLocaleString("en-IN")}/mo
                combined)
              </p>
            </div>
          </div>
        ))}

        {!hasActions && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[#888888]">
              No actionable recommendations at this time.
            </p>
          </div>
        )}
      </div>

      {/* Generate cancel letters CTA */}
      {topRecs.length > 0 && (
        <div className="border-t border-[#1a1a1a] px-6 py-4">
          <button
            type="button"
            onClick={onGenerateCancelLetters}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#00ff88] px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
          >
            <Scissors className="h-4 w-4" />
            Generate Cancel Letters
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}
