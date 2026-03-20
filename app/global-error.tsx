"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a]">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-white">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-[#888888]">
            A critical error occurred. Please refresh the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
