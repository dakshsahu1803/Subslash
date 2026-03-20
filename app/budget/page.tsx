"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  Save,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

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
  visible: { transition: { staggerChildren: 0.06 } },
};

interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: "entertainment", name: "Entertainment", limit: 1500, spent: 0, color: "#a855f7" },
  { id: "productivity", name: "Productivity", limit: 1000, spent: 0, color: "#3b82f6" },
  { id: "fitness", name: "Fitness", limit: 800, spent: 0, color: "#22c55e" },
  { id: "food", name: "Food Delivery", limit: 2000, spent: 0, color: "#f97316" },
  { id: "utilities", name: "Utilities", limit: 500, spent: 0, color: "#06b6d4" },
  { id: "education", name: "Education", limit: 1200, spent: 0, color: "#eab308" },
  { id: "other", name: "Other", limit: 500, spent: 0, color: "#888888" },
];

const BUDGET_KEY = "subslash_budget_categories";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BudgetPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    const saved = localStorage.getItem(BUDGET_KEY);
    let cats: BudgetCategory[] = saved
      ? JSON.parse(saved)
      : DEFAULT_CATEGORIES.map((c) => ({ ...c }));

    const sessionId = localStorage.getItem("subslash_session_id");
    if (sessionId) {
      try {
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("category, amount, billing_cycle")
          .eq("session_id", sessionId)
          .eq("is_cancelled", false);

        if (subs && subs.length > 0) {
          setHasSubscriptions(true);

          const spendingByCategory: Record<string, number> = {};
          for (const sub of subs) {
            const cat = sub.category || "other";
            let monthly = sub.amount || 0;
            if (sub.billing_cycle === "yearly") monthly = monthly / 12;
            if (sub.billing_cycle === "weekly") monthly = monthly * 4;
            spendingByCategory[cat] = (spendingByCategory[cat] || 0) + monthly;
          }

          cats = cats.map((c) => ({
            ...c,
            spent: Math.round(spendingByCategory[c.id] || 0),
          }));
        }
      } catch {
        // silent
      }
    }

    setCategories(cats);
    setTotalBudget(cats.reduce((s, c) => s + c.limit, 0));
    setTotalSpent(cats.reduce((s, c) => s + c.spent, 0));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function saveBudgets(updated: BudgetCategory[]) {
    setCategories(updated);
    setTotalBudget(updated.reduce((s, c) => s + c.limit, 0));
    setTotalSpent(updated.reduce((s, c) => s + c.spent, 0));
    localStorage.setItem(BUDGET_KEY, JSON.stringify(updated));
  }

  function startEdit(cat: BudgetCategory) {
    setEditingId(cat.id);
    setEditValue(cat.limit.toString());
  }

  function saveEdit(id: string) {
    const val = parseInt(editValue, 10);
    if (isNaN(val) || val < 0) return;
    const updated = categories.map((c) =>
      c.id === id ? { ...c, limit: val } : c
    );
    saveBudgets(updated);
    setEditingId(null);
  }

  function resetBudgets() {
    const reset = DEFAULT_CATEGORIES.map((c) => {
      const existing = categories.find((e) => e.id === c.id);
      return { ...c, spent: existing?.spent || 0 };
    });
    saveBudgets(reset);
  }

  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-[#080808] text-white">
          <Navbar />
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a1a1a] border-t-[#00ff88]" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const remaining = totalBudget - totalSpent;
  const usagePercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const isOverBudget = totalSpent > totalBudget;
  const overBudgetCategories = categories.filter((c) => c.spent > c.limit && c.spent > 0);
  const underBudgetCategories = categories.filter((c) => c.spent <= c.limit && c.spent > 0);

  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        <section className="mx-auto max-w-5xl px-4 pb-8 pt-28 sm:px-6 sm:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-4 py-1.5"
            >
              <Wallet className="h-3.5 w-3.5 text-[#00ff88]" />
              <span className="text-xs font-medium tracking-wide text-[#00ff88]">
                BUDGET PLANNER
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl md:text-4xl"
            >
              Subscription budget
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-2 max-w-xl text-sm text-[#888888] sm:text-base"
            >
              Set monthly limits per category. Your actual subscription spending
              is pulled from your latest audit.
            </motion.p>
          </motion.div>
        </section>

        {/* Summary Cards */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#00ff88]/10">
                <Wallet className="h-4 w-4 text-[#00ff88]" />
              </div>
              <p className="text-xs text-[#888888]">Total Budget</p>
              <p className="mt-1 text-xl font-bold tabular-nums">
                {formatCurrency(totalBudget)}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#a855f7]/10">
                <TrendingUp className="h-4 w-4 text-[#a855f7]" />
              </div>
              <p className="text-xs text-[#888888]">Current Spending</p>
              <p className="mt-1 text-xl font-bold tabular-nums">
                {formatCurrency(totalSpent)}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className={`rounded-xl border p-5 ${
                isOverBudget
                  ? "border-[#ff4444]/30 bg-[#ff4444]/[0.04]"
                  : "border-[#1a1a1a] bg-[#111111]"
              }`}
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
                  isOverBudget ? "bg-[#ff4444]/10" : "bg-[#00ff88]/10"
                }`}
              >
                {isOverBudget ? (
                  <TrendingDown className="h-4 w-4 text-[#ff4444]" />
                ) : (
                  <PiggyBank className="h-4 w-4 text-[#00ff88]" />
                )}
              </div>
              <p className="text-xs text-[#888888]">
                {isOverBudget ? "Over Budget" : "Remaining"}
              </p>
              <p
                className={`mt-1 text-xl font-bold tabular-nums ${
                  isOverBudget ? "text-[#ff4444]" : "text-[#00ff88]"
                }`}
              >
                {isOverBudget ? "-" : ""}
                {formatCurrency(Math.abs(remaining))}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffaa00]/10">
                <AlertTriangle className="h-4 w-4 text-[#ffaa00]" />
              </div>
              <p className="text-xs text-[#888888]">Over-limit Categories</p>
              <p className="mt-1 text-xl font-bold tabular-nums">
                {overBudgetCategories.length}
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Overall Progress */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Overall Usage</span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  isOverBudget ? "text-[#ff4444]" : "text-[#00ff88]"
                }`}
              >
                {usagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#1a1a1a]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className={`h-full rounded-full ${
                  isOverBudget
                    ? "bg-[#ff4444]"
                    : usagePercent > 80
                    ? "bg-[#ffaa00]"
                    : "bg-[#00ff88]"
                }`}
              />
            </div>
            <p className="mt-2 text-xs text-[#888888]">
              {formatCurrency(totalSpent)} spent of {formatCurrency(totalBudget)}{" "}
              budget
            </p>
          </motion.div>
        </section>

        {/* Category Breakdown */}
        <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Category Budgets</h2>
            <button
              onClick={resetBudgets}
              className="text-xs text-[#888888] transition-colors hover:text-white"
            >
              Reset to defaults
            </button>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-3"
          >
            {categories.map((cat) => {
              const percent =
                cat.limit > 0 ? Math.min((cat.spent / cat.limit) * 100, 100) : 0;
              const over = cat.spent > cat.limit;

              return (
                <motion.div
                  key={cat.id}
                  variants={fadeUp}
                  className={`rounded-xl border p-4 transition-all sm:p-5 ${
                    over
                      ? "border-[#ff4444]/20 bg-[#ff4444]/[0.03]"
                      : "border-[#1a1a1a] bg-[#111111] hover:border-[#2a2a2a]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium">{cat.name}</span>
                      {over && (
                        <span className="rounded-full bg-[#ff4444]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff4444]">
                          OVER LIMIT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#888888]">&#8377;</span>
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEdit(cat.id)
                            }
                            className="w-20 rounded border border-[#2a2a2a] bg-[#0a0a0a] px-2 py-1 text-xs text-white outline-none focus:border-[#00ff88]/40"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(cat.id)}
                            className="text-[#00ff88] transition-colors hover:text-[#00ff88]/80"
                          >
                            <Save className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs tabular-nums text-[#888888]">
                            {formatCurrency(cat.spent)} /{" "}
                            {formatCurrency(cat.limit)}
                          </span>
                          <button
                            onClick={() => startEdit(cat)}
                            className="text-[#444444] transition-colors hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: over ? "#ff4444" : cat.color,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Insights */}
        {hasSubscriptions && (
          <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
            <h2 className="mb-4 text-lg font-bold">Insights</h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid gap-4 sm:grid-cols-2"
            >
              {overBudgetCategories.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  className="rounded-xl border border-[#ff4444]/20 bg-[#ff4444]/[0.03] p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#ff4444]" />
                    <h3 className="text-sm font-bold text-[#ff4444]">
                      Over Budget
                    </h3>
                  </div>
                  <p className="text-sm text-[#888888]">
                    {overBudgetCategories.map((c) => c.name).join(", ")}{" "}
                    {overBudgetCategories.length === 1 ? "is" : "are"} over
                    the set limit. Consider reviewing subscriptions in{" "}
                    {overBudgetCategories.length === 1
                      ? "this category"
                      : "these categories"}{" "}
                    or adjusting your budget.
                  </p>
                </motion.div>
              )}

              {underBudgetCategories.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  className="rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/[0.03] p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00ff88]" />
                    <h3 className="text-sm font-bold text-[#00ff88]">
                      On Track
                    </h3>
                  </div>
                  <p className="text-sm text-[#888888]">
                    {underBudgetCategories.map((c) => c.name).join(", ")}{" "}
                    {underBudgetCategories.length === 1 ? "is" : "are"}{" "}
                    within budget. Keep it up!
                  </p>
                </motion.div>
              )}

              <motion.div
                variants={fadeUp}
                className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5 sm:col-span-2"
              >
                <div className="mb-3 flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-[#a855f7]" />
                  <h3 className="text-sm font-bold">Yearly Projection</h3>
                </div>
                <p className="text-sm text-[#888888]">
                  At current spending, you will spend{" "}
                  <span className="font-semibold text-white">
                    {formatCurrency(totalSpent * 12)}
                  </span>{" "}
                  per year on subscriptions. Your budgeted limit is{" "}
                  <span className="font-semibold text-[#00ff88]">
                    {formatCurrency(totalBudget * 12)}
                  </span>{" "}
                  per year.
                </p>
              </motion.div>
            </motion.div>
          </section>
        )}

        {!hasSubscriptions && (
          <section className="mx-auto max-w-2xl px-4 pb-16 text-center sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-8"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ff88]/10">
                <PiggyBank className="h-6 w-6 text-[#00ff88]" />
              </div>
              <h3 className="mb-2 text-base font-bold">
                No subscription data yet
              </h3>
              <p className="mb-5 text-sm text-[#888888]">
                Upload a bank statement to see your actual subscription spending
                against these budgets.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90"
              >
                <Plus className="h-4 w-4" />
                Upload Statement
              </Link>
            </motion.div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
