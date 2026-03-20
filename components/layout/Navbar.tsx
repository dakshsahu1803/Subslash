"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Slash,
  Menu,
  X,
  Bell,
  FileUp,
  LayoutDashboard,
  PiggyBank,
  CalendarRange,
  Wallet,
  BellRing,
  Info,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/savings", label: "Savings", icon: PiggyBank },
  { href: "/calendar", label: "Calendar", icon: CalendarRange },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("subslash_session_id") || "";
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [hasSession, setHasSession] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasSession(!!getSessionId());
  }, []);

  const fetchNotifications = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const visibleNavItems = hasSession
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) =>
        ["/about", "/contact"].includes(item.href)
      );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#080808]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="logo-icon flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/10">
            <Slash className="h-4 w-4 text-[#00ff88]" />
          </div>
          <span className="text-lg font-bold tracking-[-0.02em] text-white">
            Sub<span className="text-[#00ff88]">Slash</span>
          </span>
        </Link>

        {/* Desktop center nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#00ff88]"
                    : "text-[#888888] hover:text-white"
                }`}
              >
                {item.label}
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff4444] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#00ff88]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Notification bell */}
          {hasSession && (
            <div ref={bellRef} className="relative">
              <button
                type="button"
                onClick={() => setBellOpen(!bellOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#888888] transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff4444] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[#1a1a1a] bg-[#111111] p-1 shadow-2xl"
                  >
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-white">Notifications</p>
                    </div>
                    {recentNotifications.length === 0 ? (
                      <div className="px-3 py-6 text-center">
                        <BellRing className="mx-auto mb-2 h-5 w-5 text-[#444444]" />
                        <p className="text-xs text-[#888888]">All caught up!</p>
                      </div>
                    ) : (
                      <>
                        {recentNotifications.slice(0, 3).map((notif) => (
                          <div
                            key={notif.id}
                            className={`rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5 ${
                              !notif.is_read ? "border-l-2 border-[#00ff88]" : ""
                            }`}
                          >
                            <p className={`text-xs ${!notif.is_read ? "font-semibold text-white" : "text-[#888888]"}`}>
                              {notif.title}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#444444] line-clamp-1">
                              {notif.message}
                            </p>
                          </div>
                        ))}
                        <Link
                          href="/notifications"
                          onClick={() => setBellOpen(false)}
                          className="block border-t border-[#1a1a1a] px-3 py-2 text-center text-xs font-medium text-[#00ff88] transition-colors hover:text-[#00cc6a]"
                        >
                          View all
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00ff88] px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#00cc6a] hover:scale-[1.01]"
          >
            <FileUp className="h-3.5 w-3.5" />
            Start Audit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888888] transition-colors hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 border-l border-[#1a1a1a] bg-[#0f0f0f] lg:hidden"
            >
              <div className="flex h-full flex-col p-4">
                <div className="flex-1 space-y-1">
                  {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#00ff88]/10 text-[#00ff88]"
                            : "text-[#888888] hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.href === "/notifications" && unreadCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff4444] px-1.5 text-[10px] font-bold text-white">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-[#1a1a1a] pt-4">
                  <Link
                    href="/upload"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#00ff88] px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#00cc6a]"
                  >
                    <FileUp className="h-4 w-4" />
                    Start Audit
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
