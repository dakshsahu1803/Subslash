"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff4444]/10">
        <AlertTriangle className="h-8 w-8 text-[#ff4444]" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 max-w-md text-center text-sm text-[#888888]">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90"
      >
        Try Again
      </button>
    </div>
  );
}
