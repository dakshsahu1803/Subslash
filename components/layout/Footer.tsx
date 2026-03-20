"use client";

import Link from "next/link";
import { Slash } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const productLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload Statement" },
  { href: "/manual", label: "Add Manually" },
  { href: "/calendar", label: "Renewal Calendar" },
  { href: "/savings", label: "Savings" },
  { href: "/budget", label: "Budget Planner" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/settings", label: "Settings" },
];

const socials = [
  {
    href: "https://github.com/dakshsahu1803",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://linkedin.com/in/dakshsahu1803",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "https://instagram.com/dakshsahu1803",
    label: "Instagram",
    icon: InstagramIcon,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/10">
                <Slash className="h-4 w-4 text-[#00ff88]" />
              </div>
              <span className="text-lg font-bold tracking-[-0.02em] text-white">
                Sub<span className="text-[#00ff88]">Slash</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#888888]">
              Stop paying for subscriptions you forgot.
            </p>
            <div className="mt-5 flex items-center gap-1">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888888] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00ff88]">
                Product
              </h4>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888888] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00ff88]">
                Company
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888888] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Quick Stats placeholder */}
          <div>
            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00ff88]">
              Quick Stats
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg border border-[#1a1a1a] bg-[#0f0f0f] px-4 py-3">
                <p className="text-xs text-[#888888]">AI-powered audits</p>
                <p className="mt-0.5 text-sm font-semibold text-white">Free forever</p>
              </div>
              <div className="rounded-lg border border-[#1a1a1a] bg-[#0f0f0f] px-4 py-3">
                <p className="text-xs text-[#888888]">Average savings found</p>
                <p className="mt-0.5 text-sm font-semibold text-[#00ff88]">
                  ₹1,890/month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1a1a1a] pt-8 sm:flex-row">
          <p className="text-xs text-[#444444]">
            &copy; {new Date().getFullYear()} SubSlash. All rights reserved.
          </p>
          <p className="text-xs text-[#444444]">
            Made with{" "}
            <span className="text-red-500">&#10084;</span> by{" "}
            <a
              href="https://github.com/dakshsahu1803"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#00ff88] transition-colors hover:underline"
            >
              Daksh Sahu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
