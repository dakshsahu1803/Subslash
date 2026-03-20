import Link from "next/link";
import { ArrowRight, ScanSearch, Brain, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: ScanSearch,
    title: "Detect",
    description:
      "AI scans your bank statement and identifies every recurring charge — even the ones you forgot about.",
  },
  {
    icon: Brain,
    title: "Analyze",
    description:
      "Get a full breakdown of your subscription burn rate with smart savings recommendations.",
  },
  {
    icon: XCircle,
    title: "Cancel",
    description:
      "Generate ready-to-send cancellation letters for services you no longer need. One click.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Gradient glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00ff88]/[0.04] blur-[120px]" />
        <div className="absolute top-[60%] -right-20 h-[400px] w-[400px] rounded-full bg-[#00ff88]/[0.03] blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-4 py-1.5 animate-fade-in-up">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs font-medium tracking-wide text-[#00ff88]">
            AI-POWERED SUBSCRIPTION AUDIT
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight animate-fade-in-up stagger-1 sm:text-5xl md:text-6xl lg:text-7xl">
          Stop Paying for Things{" "}
          <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
            You Forgot About
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 animate-fade-in-up stagger-2 sm:text-lg">
          Upload your bank statement. AI finds every forgotten subscription in{" "}
          <span className="font-semibold text-white">30 seconds</span>.
        </p>

        <Link
          href="/upload"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#00ff88] px-6 py-3 text-sm font-semibold text-black transition-all animate-fade-in-up stagger-3 hover:bg-[#00ff88]/90 hover:shadow-[0_0_40px_rgba(0,255,136,0.35)] sm:px-8 sm:py-4 sm:text-base"
        >
          Audit My Subscriptions
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-4 text-xs text-zinc-600 animate-fade-in-up stagger-4">
          No sign-up required. Your data stays private.
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 hidden flex-col items-center gap-2 sm:flex">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            How it works
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-32">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#00ff88]/20 hover:bg-white/[0.04] sm:p-8 animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/10 transition-colors group-hover:bg-[#00ff88]/15 sm:mb-6">
                <feature.icon
                  className="h-6 w-6 text-[#00ff88]"
                  strokeWidth={1.5}
                />
              </div>

              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
                Step {i + 1}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-20">
          <p className="text-sm text-zinc-500">
            Built for people who subscribe to things and forget.{" "}
            <span className="text-zinc-400">That&apos;s all of us.</span>
          </p>
        </div>
      </section>
    </main>
  );
}
