"use client";

import { useState } from "react";
import Link from "next/link";
import { Slash, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-1.5">
          <div className="logo-icon flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/10">
            <Slash className="h-4 w-4 text-[#00ff88]" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Sub<span className="text-[#00ff88]">Slash</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/upload"
            className="rounded-full bg-[#00ff88] px-4 py-2 text-sm font-medium text-black transition-all hover:bg-[#00ff88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            Upload Statement
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-white sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl sm:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#00ff88] transition-colors hover:bg-[#00ff88]/5"
            >
              Upload Statement
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
