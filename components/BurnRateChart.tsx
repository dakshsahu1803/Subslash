"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Subscription } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  entertainment: "#a855f7",
  productivity: "#3b82f6",
  fitness: "#f97316",
  food: "#eab308",
  other: "#71717a",
};

interface BurnRateChartProps {
  subscriptions: Subscription[];
}

export default function BurnRateChart({ subscriptions }: BurnRateChartProps) {
  // Category breakdown for donut
  const categoryTotals = new Map<string, number>();
  for (const sub of subscriptions) {
    const monthly = toMonthly(sub);
    const current = categoryTotals.get(sub.category) || 0;
    categoryTotals.set(sub.category, current + monthly);
  }

  const donutData = Array.from(categoryTotals.entries())
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value),
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other,
    }))
    .sort((a, b) => b.value - a.value);

  // Monthly spend per service for bar chart (top 6)
  const barData = subscriptions
    .map((sub) => ({
      name:
        sub.service_name.length > 10
          ? sub.service_name.substring(0, 10) + "…"
          : sub.service_name,
      amount: Math.round(toMonthly(sub)),
      color: CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.other,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const totalMonthly = subscriptions.reduce(
    (sum, sub) => sum + toMonthly(sub),
    0
  );
  const perDay = totalMonthly / 30;

  return (
    <div className="flex flex-col gap-6">
      {/* Donut chart */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[#888888]">
          Spend by Category
        </h3>
        {donutData.length > 0 ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <div className="h-[140px] w-[140px] shrink-0 sm:h-[160px] sm:w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {donutData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-[#888888]">{cat.name}</span>
                  <span className="ml-auto text-xs font-medium tabular-nums text-white">
                    ₹{cat.value.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-[#888888]">
            No category data
          </p>
        )}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[#888888]">
          Monthly Spend by Service
        </h3>
        {barData.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 10 }}
                  tickFormatter={(v: number) => `₹${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 11 }}
                  width={90}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Monthly",
                  ]}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={16}>
                  {barData.map((entry, i) => (
                    <Cell key={`bar-${i}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-[#888888]">
            No spend data
          </p>
        )}
      </div>

      {/* Per-day stat */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5 text-center">
        <p className="text-xs text-[#888888]">
          You spend approximately
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-white">
          ₹{Math.round(perDay).toLocaleString("en-IN")}
          <span className="ml-1 text-sm font-normal text-[#888888]">
            /day
          </span>
        </p>
        <p className="mt-0.5 text-xs text-[#888888]">on subscriptions</p>
      </div>
    </div>
  );
}

function toMonthly(sub: Subscription): number {
  if (sub.billing_cycle === "yearly") return sub.amount / 12;
  if (sub.billing_cycle === "weekly") return sub.amount * 4;
  return sub.amount;
}
