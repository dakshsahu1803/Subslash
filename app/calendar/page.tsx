"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Ghost,
  ArrowRight,
  Download,
  X,
  Search,
  ChevronUp,
  ChevronDown,
  FileUp,
  Plus,
  ExternalLink,
  ListFilter,
  LayoutGrid,
  List,
} from "lucide-react";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, isBefore, differenceInDays } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SERVICE_DOMAINS } from "@/lib/constants";
import { generateICSFile, downloadICS } from "@/lib/calendarExport";
import type { RenewalEvent, CalendarSummary } from "@/types";
import toast from "react-hot-toast";

type ViewMode = "calendar" | "timeline" | "list";
type SortField = "service" | "amount" | "next_renewal" | "days_until";
type SortDir = "asc" | "desc";
type ListFilter = "all" | "7days" | "30days" | "forgotten" | "monthly" | "yearly";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

function getServiceLogo(name: string): string | null {
  const domain = SERVICE_DOMAINS[name.toLowerCase()];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
}

function ServiceLogo({ name, size = 32 }: { name: string; size?: number }) {
  const logo = getServiceLogo(name);
  const initial = name.charAt(0).toUpperCase();
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-xs font-bold text-[#888888]"
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-lg bg-white object-contain p-0.5"
      onError={() => setFailed(true)}
    />
  );
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function DaysUntilBadge({ days }: { days?: number }) {
  if (days === undefined || days < 0) return null;
  const urgent = days <= 3;
  const soon = days <= 7;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        urgent
          ? "animate-pulse bg-[#ff4444]/10 text-[#ff4444]"
          : soon
          ? "bg-[#ffaa00]/10 text-[#ffaa00]"
          : "bg-[#1a1a1a] text-[#888888]"
      }`}
    >
      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days} days`}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    entertainment: "bg-[#a855f7]/10 text-[#a855f7]",
    productivity: "bg-[#3b82f6]/10 text-[#3b82f6]",
    fitness: "bg-[#22c55e]/10 text-[#22c55e]",
    food: "bg-[#f97316]/10 text-[#f97316]",
    utilities: "bg-[#06b6d4]/10 text-[#06b6d4]",
    education: "bg-[#eab308]/10 text-[#eab308]",
    other: "bg-[#888888]/10 text-[#888888]",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${colors[category] || colors.other}`}>
      {category}
    </span>
  );
}

// ─── Calendar Grid View ───────────────────────────────────────────

function CalendarGridView({
  currentMonth,
  eventsByDate,
  selectedDate,
  onSelectDate,
}: {
  currentMonth: Date;
  eventsByDate: Record<string, RenewalEvent[]>;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const today = new Date();

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#444444]">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="aspect-square rounded-lg border border-transparent" />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const events = eventsByDate[key] || [];
          const past = isBefore(day, today) && !isToday(day);
          const todayCell = isToday(day);
          const selected = selectedDate === key;
          const total = events.reduce((s, e) => s + e.subscription.amount, 0);
          const hasForgotten = events.some((e) => e.isForgotten);
          const hasUrgent = events.some((e) => e.daysUntil !== undefined && e.daysUntil <= 3);
          const hasYearly = events.some((e) => e.subscription.billing_cycle === "yearly");

          return (
            <button
              key={key}
              onClick={() => events.length > 0 && onSelectDate(key)}
              disabled={events.length === 0}
              className={`group relative flex aspect-square flex-col items-start rounded-lg border p-1.5 text-left transition-all sm:p-2 ${
                selected
                  ? "border-[#00ff88] bg-[#00ff88]/[0.04] shadow-[0_0_12px_rgba(0,255,136,0.1)]"
                  : events.length > 0
                  ? "cursor-pointer border-[#1a1a1a] hover:border-[#2a2a2a] hover:bg-[#161616]"
                  : "border-transparent"
              } ${past ? "opacity-40" : ""}`}
            >
              <span
                className={`text-xs font-medium ${
                  todayCell
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-[#00ff88] text-xs font-bold text-black"
                    : past
                    ? "text-[#444444]"
                    : "text-[#888888]"
                }`}
              >
                {format(day, "d")}
              </span>

              {events.length > 0 && (
                <>
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {events.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className={`block h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                          ev.isForgotten
                            ? "bg-[#ff4444]"
                            : hasUrgent && ev.daysUntil !== undefined && ev.daysUntil <= 3
                            ? "bg-[#ffaa00]"
                            : hasYearly && ev.subscription.billing_cycle === "yearly"
                            ? "bg-[#a855f7]"
                            : "bg-[#00ff88]"
                        }`}
                      />
                    ))}
                    {events.length > 3 && (
                      <span className="text-[8px] text-[#888888]">+{events.length - 3}</span>
                    )}
                  </div>
                  <span className={`mt-0.5 hidden text-[10px] font-semibold tabular-nums sm:block ${
                    hasForgotten ? "text-[#ff4444]" : "text-[#00ff88]"
                  }`}>
                    {formatCurrency(total)}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-[#888888]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00ff88]" /> Active renewal</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff4444]" /> Forgotten sub</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ffaa00]" /> Due soon</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#a855f7]" /> Yearly plan</span>
      </div>
    </div>
  );
}

// ─── Timeline View ────────────────────────────────────────────────

function TimelineView({ events }: { events: RenewalEvent[] }) {
  const today = new Date();
  const futureEvents = events.filter((e) => !e.isPast);
  const grouped: Record<string, RenewalEvent[]> = {};
  for (const ev of futureEvents.slice(0, 60)) {
    const key = format(new Date(ev.date), "yyyy-MM-dd");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  }
  const sortedDates = Object.keys(grouped).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="py-16 text-center">
        <CalendarIcon className="mx-auto mb-4 h-8 w-8 text-[#444444]" />
        <p className="text-sm text-[#888888]">No upcoming renewals to show</p>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative">
      {/* Vertical line */}
      <div className="absolute left-[59px] top-0 hidden h-full w-px bg-[#1a1a1a] sm:left-[79px] sm:block" />

      {sortedDates.map((dateKey) => {
        const d = new Date(dateKey);
        const dayEvents = grouped[dateKey];
        const isTodays = isSameDay(d, today);
        const daysAway = differenceInDays(d, today);
        const urgent = daysAway <= 3;
        const soon = daysAway <= 7;

        return (
          <motion.div
            key={dateKey}
            variants={fadeUp}
            className="relative mb-6 flex gap-4 sm:gap-6"
          >
            {/* Date column */}
            <div className="w-14 shrink-0 text-right sm:w-[72px]">
              <p className={`text-xl font-bold tabular-nums sm:text-2xl ${isTodays ? "text-[#00ff88]" : "text-white"}`}>
                {format(d, "d")}
              </p>
              <p className="text-[10px] uppercase text-[#888888]">{format(d, "MMM")}</p>
              <p className="text-[10px] text-[#444444]">{format(d, "EEE")}</p>
            </div>

            {/* Node dot */}
            <div className="relative hidden items-start pt-2 sm:flex">
              <span
                className={`relative z-10 block h-3 w-3 rounded-full border-2 ${
                  isTodays
                    ? "animate-pulse border-[#00ff88] bg-[#00ff88]"
                    : urgent
                    ? "animate-pulse border-[#ff4444] bg-[#ff4444]"
                    : soon
                    ? "border-[#ffaa00] bg-[#ffaa00]"
                    : "border-[#00ff88] bg-[#00ff88]"
                }`}
              />
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-2">
              {isTodays && (
                <span className="mb-2 inline-block rounded-full bg-[#00ff88]/10 px-3 py-0.5 text-[10px] font-semibold text-[#00ff88]">
                  TODAY
                </span>
              )}
              {dayEvents.map((ev, i) => (
                <div
                  key={`${ev.subscription.id}-${i}`}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all hover:border-[#2a2a2a] sm:p-4 ${
                    ev.isForgotten
                      ? "border-l-2 border-l-[#ff4444] border-t-[#1a1a1a] border-r-[#1a1a1a] border-b-[#1a1a1a] bg-[#111111]"
                      : "border-[#1a1a1a] bg-[#111111]"
                  }`}
                >
                  <ServiceLogo name={ev.subscription.service_name} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{ev.subscription.service_name}</p>
                      <CategoryBadge category={ev.subscription.category} />
                      {ev.isForgotten && (
                        <span className="rounded-full bg-[#ff4444]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff4444]">
                          Forgotten
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#888888] capitalize">{ev.subscription.billing_cycle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums">{formatCurrency(ev.subscription.amount)}</p>
                    <DaysUntilBadge days={ev.daysUntil} />
                  </div>
                </div>
              ))}
              {dayEvents.length > 1 && (
                <p className="text-[10px] text-[#888888]">
                  Total on {format(d, "MMM d")}: {formatCurrency(dayEvents.reduce((s, e) => s + e.subscription.amount, 0))}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── List View ────────────────────────────────────────────────────

function ListView({ events }: { events: RenewalEvent[] }) {
  const [filter, setFilter] = useState<ListFilter>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("days_until");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const seen = new Set<string>();
  const uniqueEvents = events.filter((e) => {
    if (e.isPast) return false;
    const key = `${e.subscription.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filtered = useMemo(() => {
    let list = [...uniqueEvents];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.subscription.service_name.toLowerCase().includes(q));
    }

    switch (filter) {
      case "7days":
        list = list.filter((e) => e.daysUntil !== undefined && e.daysUntil <= 7);
        break;
      case "30days":
        list = list.filter((e) => e.daysUntil !== undefined && e.daysUntil <= 30);
        break;
      case "forgotten":
        list = list.filter((e) => e.isForgotten);
        break;
      case "monthly":
        list = list.filter((e) => e.subscription.billing_cycle === "monthly");
        break;
      case "yearly":
        list = list.filter((e) => e.subscription.billing_cycle === "yearly");
        break;
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "service":
          cmp = a.subscription.service_name.localeCompare(b.subscription.service_name);
          break;
        case "amount":
          cmp = a.subscription.amount - b.subscription.amount;
          break;
        case "next_renewal":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "days_until":
          cmp = (a.daysUntil ?? 999) - (b.daysUntil ?? 999);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [uniqueEvents, filter, search, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 text-[#444444]" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-[#00ff88]" /> : <ChevronDown className="h-3 w-3 text-[#00ff88]" />;
  };

  const FILTERS: { key: ListFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "7days", label: "Next 7 days" },
    { key: "30days", label: "Next 30 days" },
    { key: "forgotten", label: "Forgotten" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  const totalMonthly = filtered.reduce((s, e) => {
    if (e.subscription.billing_cycle === "yearly") return s + e.subscription.amount / 12;
    if (e.subscription.billing_cycle === "weekly") return s + e.subscription.amount * 4;
    return s + e.subscription.amount;
  }, 0);

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f.key
                ? "bg-[#00ff88]/10 text-[#00ff88]"
                : "text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#444444]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-48 rounded-lg border border-[#1a1a1a] bg-[#0f0f0f] py-2 pl-8 pr-3 text-xs text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00ff88]/40"
          />
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#1a1a1a] text-[10px] uppercase tracking-wider text-[#888888]">
              <th className="cursor-pointer px-3 py-3" onClick={() => toggleSort("service")}>
                <span className="flex items-center gap-1">Service <SortIcon field="service" /></span>
              </th>
              <th className="px-3 py-3">Category</th>
              <th className="cursor-pointer px-3 py-3" onClick={() => toggleSort("amount")}>
                <span className="flex items-center gap-1">Amount <SortIcon field="amount" /></span>
              </th>
              <th className="px-3 py-3">Billing</th>
              <th className="cursor-pointer px-3 py-3" onClick={() => toggleSort("next_renewal")}>
                <span className="flex items-center gap-1">Next Renewal <SortIcon field="next_renewal" /></span>
              </th>
              <th className="cursor-pointer px-3 py-3" onClick={() => toggleSort("days_until")}>
                <span className="flex items-center gap-1">Days Until <SortIcon field="days_until" /></span>
              </th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev) => (
              <tr key={ev.subscription.id} className="border-b border-[#1a1a1a]/50 transition-colors hover:bg-[#161616]">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <ServiceLogo name={ev.subscription.service_name} size={24} />
                    <span className="font-medium">{ev.subscription.service_name}</span>
                  </div>
                </td>
                <td className="px-3 py-3"><CategoryBadge category={ev.subscription.category} /></td>
                <td className="px-3 py-3 font-semibold tabular-nums">{formatCurrency(ev.subscription.amount)}</td>
                <td className="px-3 py-3 capitalize text-[#888888]">{ev.subscription.billing_cycle}</td>
                <td className="px-3 py-3 text-[#888888]">{format(new Date(ev.date), "MMM d, yyyy")}</td>
                <td className="px-3 py-3"><DaysUntilBadge days={ev.daysUntil} /></td>
                <td className="px-3 py-3">
                  {ev.isForgotten ? (
                    <span className="rounded-full bg-[#ff4444]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff4444]">Forgotten</span>
                  ) : (
                    <span className="rounded-full bg-[#00ff88]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00ff88]">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="space-y-2 sm:hidden">
        {filtered.map((ev) => (
          <div key={ev.subscription.id} className="flex items-center gap-3 rounded-xl border border-[#1a1a1a] bg-[#111111] p-3">
            <ServiceLogo name={ev.subscription.service_name} size={32} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{ev.subscription.service_name}</p>
              <p className="text-xs text-[#888888]">{format(new Date(ev.date), "MMM d")} &middot; <span className="capitalize">{ev.subscription.billing_cycle}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold tabular-nums">{formatCurrency(ev.subscription.amount)}</p>
              <DaysUntilBadge days={ev.daysUntil} />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-[#888888]">No subscriptions match your filters</div>
      )}

      {/* Summary */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#888888]">
        <span>Showing {filtered.length} subscriptions</span>
        <span>Total monthly: {formatCurrency(Math.round(totalMonthly))}</span>
        <span>Total yearly: {formatCurrency(Math.round(totalMonthly * 12))}</span>
      </div>
    </div>
  );
}

// ─── Day Detail Panel ─────────────────────────────────────────────

function DayDetailPanel({
  dateKey,
  events,
  onClose,
}: {
  dateKey: string;
  events: RenewalEvent[];
  onClose: () => void;
}) {
  const d = new Date(dateKey);
  const total = events.reduce((s, e) => s + e.subscription.amount, 0);

  function exportDay() {
    const ics = generateICSFile(events);
    downloadICS(ics, `subslash-${dateKey}.ics`);
    toast.success("Calendar file downloaded!");
  }

  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto border-l border-[#1a1a1a] bg-[#080808] p-5 shadow-2xl sm:w-[360px]"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-lg font-bold">{format(d, "MMMM d, yyyy")}</p>
          <p className="text-xs text-[#888888]">{format(d, "EEEE")}</p>
          <p className={`mt-1 text-sm font-semibold tabular-nums ${events.some((e) => e.isForgotten) ? "text-[#ff4444]" : "text-[#00ff88]"}`}>
            {formatCurrency(total)} due
          </p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-[#888888] transition-colors hover:bg-[#1a1a1a] hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={`${ev.subscription.id}-${i}`} className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-4">
            <div className="mb-3 flex items-center gap-3">
              <ServiceLogo name={ev.subscription.service_name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{ev.subscription.service_name}</p>
                <CategoryBadge category={ev.subscription.category} />
              </div>
              <p className="text-lg font-bold tabular-nums">{formatCurrency(ev.subscription.amount)}</p>
            </div>
            <p className="mb-3 text-xs capitalize text-[#888888]">{ev.subscription.billing_cycle} subscription</p>

            <div className="flex items-center gap-2">
              {ev.isForgotten ? (
                <span className="rounded-full bg-[#ff4444]/10 px-2.5 py-1 text-[10px] font-semibold text-[#ff4444]">Forgotten</span>
              ) : (
                <span className="rounded-full bg-[#00ff88]/10 px-2.5 py-1 text-[10px] font-semibold text-[#00ff88]">Active</span>
              )}
              {ev.daysUntil !== undefined && ev.daysUntil > 0 && <DaysUntilBadge days={ev.daysUntil} />}
              {ev.isPast && <span className="rounded-full bg-[#1a1a1a] px-2.5 py-1 text-[10px] font-semibold text-[#888888]">Paid</span>}
            </div>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/dashboard`}
                className="flex-1 rounded-lg border border-[#1a1a1a] py-2 text-center text-xs font-medium text-[#888888] transition-colors hover:border-[#2a2a2a] hover:text-white"
              >
                View Details
              </Link>
              {ev.subscription.cancel_url && (
                <a
                  href={ev.subscription.cancel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-[#ff4444]/20 px-3 py-2 text-xs font-medium text-[#ff4444] transition-colors hover:bg-[#ff4444]/[0.06]"
                >
                  Cancel <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={exportDay}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#1a1a1a] py-2.5 text-xs font-medium text-[#888888] transition-colors hover:border-[#2a2a2a] hover:text-white"
      >
        <Download className="h-3.5 w-3.5" />
        Add to Calendar
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventsByDate, setEventsByDate] = useState<Record<string, RenewalEvent[]>>({});
  const [allEvents, setAllEvents] = useState<RenewalEvent[]>([]);
  const [summary, setSummary] = useState<CalendarSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const sessionId = typeof window !== "undefined" ? localStorage.getItem("subslash_session_id") : "";
      if (!sessionId) {
        setLoading(false);
        return;
      }
      const monthStr = format(currentMonth, "yyyy-MM");
      const res = await fetch(`/api/calendar?session_id=${sessionId}&month=${monthStr}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setEventsByDate(data.events_by_date || {});
      setAllEvents(data.all_events || []);
      setSummary(data.summary || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function prevMonth() { setDirection(-1); setCurrentMonth((m) => subMonths(m, 1)); setSelectedDate(null); }
  function nextMonth() { setDirection(1); setCurrentMonth((m) => addMonths(m, 1)); setSelectedDate(null); }
  function goToday() { setDirection(0); setCurrentMonth(new Date()); setSelectedDate(null); }

  function handleExport() {
    const ics = generateICSFile(allEvents);
    downloadICS(ics);
    toast.success("Calendar file downloaded! Import it in Google Calendar.");
  }

  const noData = !loading && !error && allEvents.length === 0;

  const VIEWS: { key: ViewMode; label: string; icon: typeof CalendarIcon }[] = [
    { key: "calendar", label: "Calendar", icon: LayoutGrid },
    { key: "timeline", label: "Timeline", icon: ListFilter },
    { key: "list", label: "List", icon: List },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        {/* Page header */}
        <section className="mx-auto max-w-6xl px-4 pb-4 pt-28 sm:px-6 sm:pt-32">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/[0.06] px-4 py-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#00ff88]" />
                  <span className="text-xs font-medium tracking-wide text-[#00ff88]">RENEWAL CALENDAR</span>
                </div>
                <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">Renewal Calendar</h1>
                <p className="mt-1 text-sm text-[#888888]">Never get surprised by a subscription charge again.</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Month nav (calendar view) */}
                {view === "calendar" && (
                  <div className="flex items-center gap-1 rounded-lg border border-[#1a1a1a] bg-[#111111] p-0.5">
                    <button onClick={prevMonth} className="rounded-md p-1.5 text-[#888888] transition-colors hover:bg-[#1a1a1a] hover:text-white">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="min-w-[120px] text-center text-sm font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
                    <button onClick={nextMonth} className="rounded-md p-1.5 text-[#888888] transition-colors hover:bg-[#1a1a1a] hover:text-white">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {view === "calendar" && (
                  <button onClick={goToday} className="rounded-lg border border-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors hover:border-[#2a2a2a] hover:text-white">
                    Today
                  </button>
                )}
                <button
                  onClick={handleExport}
                  disabled={allEvents.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors hover:border-[#2a2a2a] hover:text-white disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export Calendar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Summary Cards */}
        {summary && !noData && (
          <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <motion.div variants={fadeUp} className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-4 sm:p-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/10">
                  <CalendarIcon className="h-4 w-4 text-[#00ff88]" />
                </div>
                <p className="text-[10px] text-[#888888]">Due This Month</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums">{formatCurrency(summary.this_month_total)}</p>
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-4 sm:p-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffaa00]/10">
                  <Clock className="h-4 w-4 text-[#ffaa00]" />
                </div>
                <p className="text-[10px] text-[#888888]">Next 7 Days</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums">{formatCurrency(summary.next_7_days_total)}</p>
                <p className="text-[10px] text-[#888888]">{summary.next_7_days_count} renewals</p>
              </motion.div>

              <motion.div variants={fadeUp} className={`rounded-xl border p-4 sm:p-5 ${summary.forgotten_count > 0 ? "border-[#ff4444]/20 bg-[#ff4444]/[0.03]" : "border-[#1a1a1a] bg-[#111111]"}`}>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4444]/10">
                  <Ghost className="h-4 w-4 text-[#ff4444]" />
                </div>
                <p className="text-[10px] text-[#888888]">Forgotten Renewals</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums">{summary.forgotten_count}</p>
                {summary.forgotten_monthly_waste > 0 && (
                  <p className="text-[10px] text-[#ff4444]">{formatCurrency(summary.forgotten_monthly_waste)} wasted/mo</p>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-4 sm:p-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#a855f7]/10">
                  <ArrowRight className="h-4 w-4 text-[#a855f7]" />
                </div>
                <p className="text-[10px] text-[#888888]">Next Renewal</p>
                {summary.next_renewal ? (
                  <>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <ServiceLogo name={summary.next_renewal.subscription.service_name} size={20} />
                      <p className="truncate text-sm font-bold">{summary.next_renewal.subscription.service_name}</p>
                    </div>
                    <p className="text-[10px] text-[#888888]">
                      {format(new Date(summary.next_renewal.date), "MMM d")} &middot; {formatCurrency(summary.next_renewal.subscription.amount)}
                    </p>
                  </>
                ) : (
                  <p className="mt-0.5 text-sm text-[#888888]">None upcoming</p>
                )}
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* View Toggle */}
        <section className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="inline-flex rounded-lg border border-[#1a1a1a] bg-[#111111] p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-all ${
                  view === v.key
                    ? "bg-[#00ff88]/10 text-[#00ff88]"
                    : "text-[#888888] hover:text-white"
                }`}
              >
                <v.icon className="h-3.5 w-3.5" />
                {v.label}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a1a1a] border-t-[#00ff88]" />
            </div>
          )}

          {error && (
            <div className="py-16 text-center">
              <p className="mb-4 text-sm text-[#ff4444]">Failed to load your renewals.</p>
              <button onClick={fetchData} className="rounded-lg bg-[#00ff88] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90">
                Retry
              </button>
            </div>
          )}

          {noData && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="py-16 text-center">
              <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-[#444444]" />
              <h3 className="mb-2 text-base font-bold">No subscriptions tracked yet</h3>
              <p className="mb-6 text-sm text-[#888888]">Add subscriptions to see your renewal calendar</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/upload" className="flex items-center gap-2 rounded-full bg-[#00ff88] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90">
                  <FileUp className="h-4 w-4" /> Upload Statement
                </Link>
                <Link href="/manual" className="flex items-center gap-2 rounded-full border border-[#1a1a1a] px-5 py-2.5 text-sm font-semibold transition-all hover:border-[#2a2a2a] hover:bg-[#111111]">
                  <Plus className="h-4 w-4" /> Add Manually
                </Link>
              </div>
            </motion.div>
          )}

          {!loading && !error && !noData && (
            <div className="relative flex gap-6">
              <div className={`flex-1 ${selectedDate ? "lg:pr-[380px]" : ""}`}>
                <AnimatePresence mode="wait">
                  {view === "calendar" && (
                    <motion.div key={`cal-${format(currentMonth, "yyyy-MM")}`} initial={{ opacity: 0, x: direction * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -40 }} transition={{ duration: 0.25 }}>
                      <CalendarGridView
                        currentMonth={currentMonth}
                        eventsByDate={eventsByDate}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                      />
                    </motion.div>
                  )}
                  {view === "timeline" && (
                    <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <TimelineView events={allEvents} />
                    </motion.div>
                  )}
                  {view === "list" && (
                    <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <ListView events={allEvents} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Day Detail Panel (desktop) */}
              <AnimatePresence>
                {selectedDate && eventsByDate[selectedDate] && (
                  <DayDetailPanel
                    dateKey={selectedDate}
                    events={eventsByDate[selectedDate]}
                    onClose={() => setSelectedDate(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
