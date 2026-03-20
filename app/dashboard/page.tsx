"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Flame,
  CalendarRange,
  Layers,
  PiggyBank,
  FileUp,
  FileText,
  ArrowRight,
  Clock,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import BurnRateChart from "@/components/BurnRateChart";
import SavingsAdvisor from "@/components/SavingsAdvisor";
import CancelModal from "@/components/CancelModal";
import ShareCard from "@/components/ShareCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { useCountUp } from "@/hooks/useCountUp";
import { supabase } from "@/lib/supabase";
import type { Subscription, AIAnalysis, Recommendation } from "@/types";

interface UploadRecord {
  id: string;
  file_name: string;
  status: string;
  created_at: string;
  session_id: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("subslash_session_id") || "";
}

function ReportHistory() {
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUploads() {
      const sessionId = getSessionId();
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("uploads")
        .select("id, file_name, status, created_at, session_id")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUploads(data);
      }
      setLoading(false);
    }

    fetchUploads();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-white/5" />
                <div className="h-3 w-24 rounded bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const doneUploads = uploads.filter((u) => u.status === "done");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 animate-fade-in-up">
      {doneUploads.length > 0 ? (
        <div className="w-full max-w-xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-white">Your Reports</h2>
            <p className="mt-1 text-sm text-[#888888]">
              Click any report to view the full audit
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {doneUploads.map((upload, i) => (
              <button
                key={upload.id}
                type="button"
                onClick={() =>
                  router.push(`/dashboard?upload_id=${upload.id}`)
                }
                className={`group flex items-center gap-4 rounded-xl border border-[#1a1a1a] bg-[#111111] p-4 text-left transition-all hover:border-[#00ff88]/20 hover:bg-[#111111]/80 animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00ff88]/10">
                  <FileText className="h-5 w-5 text-[#00ff88]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {upload.file_name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#888888]">
                    <Clock className="h-3 w-3" />
                    {new Date(upload.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#888888] transition-transform group-hover:translate-x-1 group-hover:text-[#00ff88]" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="inline-flex items-center gap-2 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            >
              <FileUp className="h-4 w-4" />
              Upload New Statement
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
            <FileUp className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">
              No statement analyzed yet
            </h2>
            <p className="mt-1 text-sm text-[#888888]">
              Upload a bank statement to see your subscription audit
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/upload")}
            className="mt-2 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
          >
            Upload Statement
          </button>
        </>
      )}
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uploadId = searchParams.get("upload_id");

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [cancelSet, setCancelSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalSub, setCancelModalSub] = useState<Subscription | null>(
    null
  );

  useEffect(() => {
    if (!uploadId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      const [subsRes, analysisRes] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("*")
          .eq("upload_id", uploadId)
          .order("amount", { ascending: false }),
        supabase
          .from("ai_analysis")
          .select("*")
          .eq("upload_id", uploadId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
      ]);

      if (subsRes.error) {
        setError("Failed to load subscriptions");
        setLoading(false);
        return;
      }

      setSubscriptions(subsRes.data || []);
      if (analysisRes.data) setAnalysis(analysisRes.data);
      setLoading(false);
    }

    fetchData();
  }, [uploadId]);

  const toggleCancel = useCallback((id: string) => {
    setCancelSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleMarkCancelled = useCallback((id: string) => {
    setCancelSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, is_forgotten: true } : sub
      )
    );
  }, []);

  const openCancelModal = useCallback((sub: Subscription) => {
    setCancelModalSub(sub);
  }, []);

  const toMonthly = useCallback((sub: Subscription) => {
    if (sub.billing_cycle === "yearly") return sub.amount / 12;
    if (sub.billing_cycle === "weekly") return sub.amount * 4;
    return sub.amount;
  }, []);

  const stats = useMemo(() => {
    const totalMonthly = subscriptions.reduce(
      (sum, sub) => sum + toMonthly(sub),
      0
    );

    const cancelSavings = subscriptions
      .filter((sub) => cancelSet.has(sub.id))
      .reduce((sum, sub) => sum + toMonthly(sub), 0);

    const aiForgottenSavings = analysis?.potential_savings ?? 0;
    const potentialSavings =
      cancelSavings > 0 ? cancelSavings : aiForgottenSavings;

    return {
      totalMonthly: Math.round(totalMonthly),
      yearlyCost: Math.round(totalMonthly * 12),
      count: subscriptions.length,
      potentialSavings: Math.round(potentialSavings),
      cancelCount: cancelSet.size,
    };
  }, [subscriptions, cancelSet, analysis, toMonthly]);

  const recommendations: Recommendation[] = useMemo(() => {
    if (analysis?.recommendations && Array.isArray(analysis.recommendations)) {
      return analysis.recommendations;
    }
    return subscriptions
      .filter((sub) => sub.is_forgotten)
      .map((sub) => ({
        service_name: sub.service_name,
        action: "cancel" as const,
        reason: `Charged ${sub.times_charged} time(s) — likely forgotten`,
        estimated_savings: toMonthly(sub),
      }));
  }, [analysis, subscriptions, toMonthly]);

  const animatedMonthly = useCountUp(stats.totalMonthly);
  const animatedYearly = useCountUp(stats.yearlyCost);
  const animatedSavings = useCountUp(stats.potentialSavings);

  if (!uploadId) {
    return <ReportHistory />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-[#ff4444]">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/20"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Back to reports */}
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        ← All Reports
      </button>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="Monthly Burn"
            value={`₹${animatedMonthly.toLocaleString("en-IN")}`}
            glow={stats.totalMonthly > 5000 ? "red" : undefined}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            icon={<CalendarRange className="h-4 w-4" />}
            label="Yearly Cost"
            value={`₹${animatedYearly.toLocaleString("en-IN")}`}
            glow={stats.yearlyCost > 60000 ? "red" : undefined}
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            icon={<Layers className="h-4 w-4" />}
            label="Subscriptions"
            value={String(stats.count)}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            icon={<PiggyBank className="h-4 w-4" />}
            label={
              stats.cancelCount > 0
                ? `Savings (${stats.cancelCount} selected)`
                : "Potential Savings"
            }
            value={`₹${animatedSavings.toLocaleString("en-IN")}`}
            glow="green"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left — subscription list */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#888888]">
              {subscriptions.length} subscription
              {subscriptions.length !== 1 ? "s" : ""} detected
            </h2>
            {cancelSet.size > 0 && (
              <span className="text-xs text-[#00ff88]">
                {cancelSet.size} marked for cancellation
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {subscriptions.map((sub, i) => (
              <div
                key={sub.id}
                className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
              >
                <SubscriptionCard
                  subscription={sub}
                  markedForCancel={cancelSet.has(sub.id)}
                  onToggleCancel={toggleCancel}
                  onGenerateLetter={openCancelModal}
                />
              </div>
            ))}
            {subscriptions.length === 0 && (
              <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] py-12 text-center">
                <p className="text-sm text-[#888888]">
                  No subscriptions detected in this statement
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — charts + share */}
        <div className="flex flex-col gap-6">
          <div className="animate-fade-in-up stagger-2">
            <BurnRateChart subscriptions={subscriptions} />
          </div>
          <div className="animate-fade-in-up stagger-4">
            <ShareCard
              totalBurn={stats.totalMonthly}
              savings={stats.potentialSavings}
              subsCount={stats.count}
            />
          </div>
        </div>
      </div>

      {/* Bottom — AI recommendations */}
      <div className="mt-6 animate-fade-in-up stagger-6 sm:mt-8">
        <SavingsAdvisor
          recommendations={recommendations}
          subscriptions={subscriptions}
          summary={
            analysis?.summary ||
            `Found ${subscriptions.length} subscription(s).`
          }
          onGenerateCancelLetters={() => {
            const firstForgotten = subscriptions.find((s) => s.is_forgotten);
            if (firstForgotten) {
              setCancelModalSub(firstForgotten);
            } else if (subscriptions.length > 0) {
              setCancelModalSub(subscriptions[0]);
            }
          }}
        />
      </div>

      {/* Cancel Modal */}
      {cancelModalSub && (
        <CancelModal
          subscription={cancelModalSub}
          onClose={() => setCancelModalSub(null)}
          onMarkCancelled={handleMarkCancelled}
        />
      )}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  glow?: "red" | "green";
}) {
  const glowStyle =
    glow === "red"
      ? "shadow-[0_0_30px_-8px_rgba(255,68,68,0.3)]"
      : glow === "green"
        ? "shadow-[0_0_30px_-8px_rgba(0,255,136,0.3)]"
        : "";

  const iconColor =
    glow === "red"
      ? "text-[#ff4444]"
      : glow === "green"
        ? "text-[#00ff88]"
        : "text-[#888888]";

  const valueColor =
    glow === "red"
      ? "text-[#ff4444]"
      : glow === "green"
        ? "text-[#00ff88]"
        : "text-white";

  return (
    <div
      className={`rounded-xl border border-[#1a1a1a] bg-[#111111] p-4 transition-shadow sm:p-5 ${glowStyle}`}
    >
      <div className="flex items-center gap-2">
        <span className={iconColor}>{icon}</span>
        <span className="text-xs text-[#888888]">{label}</span>
      </div>
      <p className={`mt-2 text-xl font-bold tabular-nums sm:text-2xl ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
