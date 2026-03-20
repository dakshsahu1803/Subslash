"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Send,
  ChevronDown,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const FAQS = [
  {
    q: "Is SubSlash really free?",
    a: "Yes, completely free. No hidden charges, no premium tiers, no credit card required. SubSlash is a personal project built to help people save money.",
  },
  {
    q: "Is my bank statement data safe?",
    a: "Your bank statement is processed in real-time and never permanently stored. The PDF is uploaded to a secure bucket for analysis and the extracted subscription data is saved to your session \u2014 but the raw statement file itself is not retained after processing.",
  },
  {
    q: "Which banks are supported?",
    a: "SubSlash works with PDF statements from all major Indian banks including SBI, HDFC, ICICI, Axis, Kotak, Yes Bank, IndusInd, and more. If the statement is a standard text-based PDF, it will work.",
  },
  {
    q: "How accurate is the AI detection?",
    a: "The AI is trained to identify recurring charge patterns with high confidence. It assigns a confidence level (high, medium, or low) to each detected subscription. You can always manually add or remove subscriptions from your audit.",
  },
  {
    q: "Can I upload multiple statements?",
    a: "Yes! Each upload creates a separate audit report. You can view all your past reports from the Dashboard page.",
  },
  {
    q: "Does SubSlash actually cancel subscriptions for me?",
    a: "Not automatically. SubSlash generates professional cancellation emails and provides direct cancel links for popular services. You copy the email and send it yourself \u2014 this keeps you in full control.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);

    try {
      const { supabase } = await import("@/lib/supabase");

      await supabase.from("feedback").insert({
        session_id: localStorage.getItem("session_id") || "anonymous",
        type: "contact",
        message: `From: ${name} (${email})\n\n${message}`,
        page: "/contact",
      });

      toast.success("Message sent! We\u2019ll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        <section className="mx-auto max-w-3xl px-4 pb-8 pt-28 text-center sm:px-6 sm:pt-36">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-4 py-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#00ff88]" />
              <span className="text-xs font-medium tracking-wide text-[#00ff88]">
                GET IN TOUCH
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-5xl"
            >
              Have a question?{" "}
              <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
                Let&apos;s talk.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#888888] sm:text-lg"
            >
              Whether it&apos;s feedback, a bug report, a feature request, or just
              saying hi \u2014 drop a message below.
            </motion.p>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-5">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 sm:p-8"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-[#888888]"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00ff88]/40"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-[#888888]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00ff88]/40"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-[#888888]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what\u2019s on your mind..."
                  className="w-full resize-none rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00ff88]/40"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90 disabled:opacity-50"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6 lg:col-span-2"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ff88]/10">
                <Mail className="h-5 w-5 text-[#00ff88]" />
              </div>
              <h3 className="mb-1 text-sm font-bold">Email</h3>
              <a
                href="mailto:dakshsahu1803@gmail.com"
                className="text-sm text-[#888888] transition-colors hover:text-[#00ff88]"
              >
                dakshsahu1803@gmail.com
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-6"
            >
              <h3 className="mb-4 text-sm font-bold">Connect</h3>
              <div className="flex gap-2">
                <a
                  href="https://github.com/dakshsahu1803"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1a1a1a] text-[#888888] transition-all hover:border-[#2a2a2a] hover:text-white"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/in/dakshsahu1803"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1a1a1a] text-[#888888] transition-all hover:border-[#2a2a2a] hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/dakshsahu1803"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1a1a1a] text-[#888888] transition-all hover:border-[#2a2a2a] hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-6"
            >
              <h3 className="mb-1 text-sm font-bold">Response time</h3>
              <p className="text-sm text-[#888888]">
                Usually within 24 hours
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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
              FAQ
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-center text-2xl font-bold tracking-[-0.02em] sm:text-3xl"
            >
              Frequently asked questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-10 space-y-3"
          >
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-xl border border-[#1a1a1a] bg-[#111111] transition-all hover:border-[#2a2a2a]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="pr-4 text-sm font-medium">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#888888] transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-[#1a1a1a] px-5 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-[#888888]">
                      {faq.a}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
