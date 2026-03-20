import Link from "next/link";
import { Slash } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/10">
        <Slash className="h-8 w-8 text-[#00ff88]" />
      </div>
      <h2 className="mt-6 text-4xl font-bold">404</h2>
      <p className="mt-2 text-sm text-[#888888]">
        This page doesn&apos;t exist. Maybe it was a forgotten subscription too.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90"
      >
        Go Home
      </Link>
    </div>
  );
}
