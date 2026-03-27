"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ScanSearch,
  Brain,
  XCircle,
  CalendarRange,
  Target,
  PiggyBank,
  Wallet,
  Share2,
  Shield,
  Zap,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// ─── Animation Variants ──────────────────────────────────

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Counter Hook ────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return { value, ref };
}

// ─── Section 2: Hero ─────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center sm:px-6">
      {/* Gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00ff88]/[0.04] blur-[120px]" />
        <div className="absolute top-[60%] -right-20 h-[400px] w-[400px] rounded-full bg-[#00ff88]/[0.03] blur-[100px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 flex max-w-4xl flex-col items-center"
      >
        {/* Pill badge */}
        <motion.div
          variants={fadeUp}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-4 py-1.5"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs font-medium tracking-wide text-[#00ff88]">
            AI-POWERED &middot; FREE FOREVER &middot; NO SIGNUP
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[68px]"
        >
          Stop Paying For Things{" "}
          <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
            You Already Forgot
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[#888888] sm:text-lg md:text-xl"
        >
          Upload your bank statement. Our AI finds every forgotten, duplicate,
          and overpriced subscription in{" "}
          <span className="font-semibold text-white">30 seconds</span>. The
          average Indian professional saves{" "}
          <span className="font-semibold text-[#00ff88]">₹22,680/year</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/upload"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#00ff88] px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00cc6a] hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] sm:text-base"
          >
            Audit My Subscriptions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/manual"
            className="inline-flex items-center gap-2 rounded-lg border border-[#1a1a1a] bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#2a2a2a] hover:bg-[#111111] sm:text-base"
          >
            Add Manually
          </Link>
        </motion.div>

        {/* Privacy note */}
        <motion.p variants={fadeUp} className="mt-5 text-xs text-[#444444]">
          No account &middot; No credit card &middot; Your PDF is never stored
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 hidden flex-col items-center gap-2 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
          How it works
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[#444444] to-transparent" />
      </div>
    </section>
  );
}

// ─── Section 3: Social Proof Marquee ─────────────────────────

const PROOF_NAMES = [
  "Software Engineers",
  "Product Managers",
  "Startup Founders",
  "Freelancers",
  "Chartered Accountants",
  "MBA Students",
  "Data Scientists",
  "UX Designers",
  "Content Creators",
  "DevOps Engineers",
];

function SocialProof() {
  return (
    <section className="relative overflow-hidden border-y border-[#1a1a1a] bg-[#0f0f0f]/50 py-5">
      <div className="flex animate-marquee items-center gap-8 whitespace-nowrap">
        {[...PROOF_NAMES, ...PROOF_NAMES].map((name, i) => (
          <span key={i} className="text-sm font-medium text-[#444444]">
            {name}
          </span>
        ))}
      </div>
      <p className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/80 text-xs font-medium text-[#888888]">
        Trusted by professionals across India
      </p>
    </section>
  );
}

// ─── Section 4: Stats ────────────────────────────────────────

function StatCard({ value, prefix, suffix, label }: { value: number; prefix: string; suffix: string; label: string }) {
  const counter = useCountUp(value);
  return (
    <motion.div
      ref={counter.ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5 text-center transition-all hover:border-[#2a2a2a] sm:p-6"
    >
      <p className="text-3xl font-bold tabular-nums tracking-tight text-[#00ff88] sm:text-4xl">
        {prefix}
        {counter.value.toLocaleString("en-IN")}
        {suffix && <span className="ml-1 text-lg">{suffix}</span>}
      </p>
      <p className="mt-2 text-xs text-[#888888] sm:text-sm">{label}</p>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <StatCard value={22680} prefix="₹" suffix="" label="Average yearly savings" />
        <StatCard value={30} prefix="" suffix="sec" label="Average audit time" />
        <StatCard value={11} prefix="" suffix="" label="Avg subscriptions found" />
        <StatCard value={100} prefix="" suffix="%" label="Free to use" />
      </div>
    </section>
  );
}

// ─── Section 5: How It Works ─────────────────────────────────

const STEPS = [
  {
    icon: ScanSearch,
    title: "Upload",
    description:
      "Export your bank statement as PDF from any Indian bank app. Drop it into SubSlash.",
  },
  {
    icon: Brain,
    title: "AI Detects",
    description:
      "Our AI reads every transaction, identifies recurring charges, flags forgotten services, and spots duplicates.",
  },
  {
    icon: XCircle,
    title: "Take Action",
    description:
      "See your full audit. Cancel what you don't need. Generate cancellation emails. Start saving.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="text-center"
      >
        <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00ff88]">
          How It Works
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          Three steps. Thirty seconds.
        </motion.h2>
      </motion.div>

      <div className="relative mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Connecting line (desktop) */}
        <div className="absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent md:block" />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl border border-[#1a1a1a] bg-[#111111] p-6 transition-all hover:border-[#2a2a2a] hover:shadow-[0_0_20px_rgba(0,255,136,0.05)] sm:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/10 transition-colors group-hover:bg-[#00ff88]/15">
              <step.icon className="h-6 w-6 text-[#00ff88]" strokeWidth={1.5} />
            </div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#444444]">
              Step {i + 1}
            </p>
            <h3 className="mb-2 text-xl font-bold tracking-[-0.01em]">{step.title}</h3>
            <p className="text-sm leading-relaxed text-[#888888]">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 6: Features Grid ────────────────────────────────

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Upload & AI Detect",
    description: "Drop your bank statement. AI extracts every recurring charge in seconds.",
  },
  {
    icon: CalendarRange,
    title: "Renewal Calendar",
    description: "See exactly when money leaves your account. Plan cash flow like a pro.",
  },
  {
    icon: Target,
    title: "Subscription Score",
    description: "A single score out of 100 tells you how optimized your spending is.",
  },
  {
    icon: PiggyBank,
    title: "Free Alternatives",
    description: "For every paid subscription, see free or cheaper alternatives instantly.",
  },
  {
    icon: Wallet,
    title: "Budget Planner",
    description: "Set category limits. Track spend vs budget. Never overshoot again.",
  },
  {
    icon: Share2,
    title: "Shareable Audit Card",
    description: "Generate a beautiful image card showing your audit results. Share on LinkedIn.",
  },
];

function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="text-center"
      >
        <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00ff88]">
          Features
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          Everything you need to take control
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            className="group rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 transition-all hover:border-[#2a2a2a] hover:shadow-[0_0_20px_rgba(0,255,136,0.05)]"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ff88]/10 transition-colors group-hover:bg-[#00ff88]/15">
              <feature.icon className="h-5 w-5 text-[#00ff88]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1.5 text-base font-bold tracking-[-0.01em]">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-[#888888]">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Section 7: Interactive Waste Calculator ─────────────────

function WasteCalculator() {
  const [count, setCount] = useState(6);
  const avgCost = 380;
  const wasteRate = 0.35;
  const monthlyWaste = Math.round(count * avgCost * wasteRate);
  const yearlyWaste = monthlyWaste * 12;

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="rounded-2xl border border-[#1a1a1a] bg-[#111111] p-6 sm:p-10"
      >
        <motion.p variants={fadeUp} className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#00ff88]">
          Interactive Demo
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-center text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
          How much are you wasting?
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-8">
          <label className="mb-3 block text-center text-sm text-[#888888]">
            How many subscriptions do you have?
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1a1a1a] text-[#888888] transition-colors hover:border-[#2a2a2a] hover:text-white"
              aria-label="Decrease"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="h-2 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-[#1a1a1a] accent-[#00ff88] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00ff88]"
            />
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1a1a1a] text-[#888888] transition-colors hover:border-[#2a2a2a] hover:text-white"
              aria-label="Increase"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-2xl font-bold text-white">{count}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#ff4444]/20 bg-[#ff4444]/[0.06] p-5 text-center">
            <p className="text-xs text-[#888888]">Estimated monthly waste</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#ff4444]">
              ₹{monthlyWaste.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/[0.06] p-5 text-center">
            <p className="text-xs text-[#888888]">You could save per year</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#00ff88]">
              ₹{yearlyWaste.toLocaleString("en-IN")}
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 text-center">
          <p className="text-xs text-[#444444]">
            Based on average subscription cost of ₹{avgCost}/mo and{" "}
            {Math.round(wasteRate * 100)}% waste rate across Indian professionals
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Section 8: Testimonials ─────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "I had no idea I was still paying for Canva Pro and Notion. SubSlash found both in seconds. That's ₹1,139 back every month.",
    name: "Priya Sharma",
    role: "Software Engineer at Infosys",
    savings: "₹1,139/mo saved",
  },
  {
    quote:
      "The subscription score was a wake-up call. I was at 42/100. After cancelling 4 subscriptions and switching to annual plans, I'm at 88.",
    name: "Arjun Mehta",
    role: "Product Manager at Flipkart",
    savings: "₹2,340/mo saved",
  },
  {
    quote:
      "As a CA, I recommend SubSlash to all my clients. It's the simplest way to find money leaks in personal finances.",
    name: "Neha Gupta",
    role: "Chartered Accountant, Mumbai",
    savings: "₹18,000/yr saved",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="text-center"
      >
        <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00ff88]">
          Testimonials
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          Real savings. Real people.
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-3"
      >
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="flex flex-col rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 transition-all hover:border-[#2a2a2a]"
          >
            <p className="flex-1 text-sm leading-relaxed text-[#888888]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-[#1a1a1a] pt-4">
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-[#444444]">{t.role}</p>
              </div>
              <span className="rounded-full bg-[#00ff88]/10 px-2.5 py-1 text-[11px] font-semibold text-[#00ff88]">
                {t.savings}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Section 9: FAQ ──────────────────────────────────────────

const FAQS = [
  {
    q: "Is SubSlash really free?",
    a: "Yes, completely free. No hidden charges, no premium tier, no credit card required. Ever.",
  },
  {
    q: "Is my bank statement safe?",
    a: "Your PDF is sent to our server, parsed for text content, analyzed by AI, then immediately discarded. We never store your raw financial document.",
  },
  {
    q: "Which banks are supported?",
    a: "Any bank that exports statements as PDF: SBI, HDFC, ICICI, Axis, Kotak, Yes Bank, IndusInd, and more. If it's a PDF, we can read it.",
  },
  {
    q: "Can I use it without uploading a statement?",
    a: "Absolutely! Use 'Add Manually' to enter subscriptions one by one — no PDF required. You get the full dashboard experience either way.",
  },
  {
    q: "How does the AI detect forgotten subscriptions?",
    a: "Our AI analyzes charge patterns, frequency, and amounts. Services charged 3+ times with patterns suggesting low usage are flagged as potentially forgotten.",
  },
  {
    q: "Can I share my results?",
    a: "Yes! Generate a beautiful shareable image card of your audit results and share it on LinkedIn, Twitter, or WhatsApp.",
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#1a1a1a]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-white sm:text-base">{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#888888] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed text-[#888888]">{item.a}</p>
      </motion.div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="text-center"
      >
        <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00ff88]">
          FAQ
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          Common questions
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="mt-10"
      >
        {FAQS.map((item, i) => (
          <motion.div key={i} variants={fadeUp}>
            <FAQAccordionItem
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Section 10: Final CTA ───────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ff88]/[0.06] blur-[120px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="relative z-10 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl md:text-5xl"
        >
          Ready to stop the money leak?
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-lg text-base text-[#888888] sm:text-lg">
          Find out exactly where your money is going. It takes 30 seconds and
          costs nothing.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8">
          <Link
            href="/upload"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#00ff88] px-8 py-4 text-base font-semibold text-black transition-all hover:bg-[#00cc6a] hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]"
          >
            Start Your Free Audit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-4 flex items-center justify-center gap-4 text-xs text-[#444444]">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Privacy first
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> 30 second audit
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />
        <Hero />
        <SocialProof />
        <StatsSection />
        <HowItWorks />
        <FeaturesGrid />
        <WasteCalculator />
        <Testimonials />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
