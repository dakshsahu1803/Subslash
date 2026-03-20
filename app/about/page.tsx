"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  Shield,
  Zap,
  ScanSearch,
  Brain,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const MISSION = [
  {
    icon: Banknote,
    title: "Save Real Money",
    text: "Users find an average of \u20B91,890/month in forgotten subscriptions. That\u2019s a weekend trip every month.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    text: "Your bank statement is analyzed and immediately discarded. We never store your financial documents. Never.",
  },
  {
    icon: Zap,
    title: "30 Seconds",
    text: "From upload to full audit in under 30 seconds. No account needed. No credit card. No catch.",
  },
];

const STEPS = [
  {
    icon: ScanSearch,
    title: "Upload Your Statement",
    text: "Export your bank statement as a PDF from your bank\u2019s app or website. SubSlash supports all major Indian banks \u2014 SBI, HDFC, ICICI, Axis, Kotak, and more.",
  },
  {
    icon: Brain,
    title: "AI Analyzes Everything",
    text: "Our AI reads every transaction and uses pattern recognition to identify recurring charges. It detects subscription patterns, flags forgotten services, and spots duplicate spending.",
  },
  {
    icon: BarChart3,
    title: "See Your Full Audit",
    text: "Your complete audit is displayed in a beautiful dashboard. You see every subscription, what you\u2019re spending, what you\u2019re wasting, and exactly how to fix it.",
  },
];

const STATS = [
  { value: "\u20B922,680", label: "Average yearly savings per user" },
  { value: "30 sec", label: "Average audit time" },
  { value: "11", label: "Average subscriptions discovered" },
  { value: "Free", label: "Cost to use SubSlash" },
];

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888888] transition-colors hover:bg-[#1a1a1a] hover:text-white"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        <section className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-36">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-4 py-1.5"
            >
              <span className="text-xs font-medium tracking-wide text-[#00ff88]">
                OUR STORY
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-5xl"
            >
              Built to stop the{" "}
              <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
                silent money drain
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#888888] sm:text-lg"
            >
              SubSlash was born from a simple realization: most people have no
              idea how much they spend on subscriptions. The average Indian
              professional pays for 11 subscriptions and actively uses maybe 6
              of them. That is thousands of rupees silently leaving every year.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#888888] sm:text-lg"
            >
              We built SubSlash to fix that. Upload your bank statement, get a
              complete audit in 30 seconds, and finally know exactly where your
              money is going.
            </motion.p>
          </motion.div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-4 sm:gap-6 md:grid-cols-3"
          >
            {MISSION.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 transition-all hover:border-[#2a2a2a] hover:shadow-[0_0_20px_rgba(0,255,136,0.05)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ff88]/10 transition-colors group-hover:bg-[#00ff88]/15">
                  <item.icon
                    className="h-5 w-5 text-[#00ff88]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-2 text-base font-bold tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#888888]">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5 text-center transition-all hover:border-[#2a2a2a] sm:p-6"
              >
                <p className="text-2xl font-bold tabular-nums tracking-tight text-[#00ff88] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-[#888888] sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#00ff88]"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-center text-2xl font-bold tracking-[-0.02em] sm:text-3xl"
            >
              The technical details
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-12 space-y-6"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="group flex gap-5 rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 transition-all hover:border-[#2a2a2a] sm:p-8"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00ff88]/10 font-bold text-[#00ff88] transition-colors group-hover:bg-[#00ff88]/15">
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden h-full w-px bg-[#1a1a1a] sm:block" />
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-base font-bold tracking-[-0.01em] sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#888888]">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 text-center sm:p-10"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#a855f7]/20">
              <span className="text-xl font-bold text-white">DS</span>
            </div>
            <p className="text-sm leading-relaxed text-[#888888] sm:text-base">
              &ldquo;Built by a developer who got tired of finding forgotten
              subscriptions on his own bank statement.&rdquo;
            </p>
            <p className="mt-4 text-base font-semibold text-white">
              Daksh Sahu
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <SocialIcon
                href="https://github.com/dakshsahu1803"
                label="GitHub"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://linkedin.com/in/dakshsahu1803"
                label="LinkedIn"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://instagram.com/dakshsahu1803"
                label="Instagram"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </SocialIcon>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
