import Navbar from "@/components/Navbar";
import Link from "next/link";
import { PiggyBank } from "lucide-react";

export default function SavingsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/10">
          <PiggyBank className="h-8 w-8 text-[#00ff88]" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Savings Recommendations</h2>
        <p className="mt-2 text-center text-sm text-[#888888]">
          Upload a statement to get AI-powered savings recommendations
        </p>
        <Link
          href="/upload"
          className="mt-6 rounded-full bg-[#00ff88] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#00ff88]/90"
        >
          Upload Statement
        </Link>
      </div>
    </main>
  );
}
