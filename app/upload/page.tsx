"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";

type UploadStage =
  | "idle"
  | "uploading"
  | "parsing"
  | "done"
  | "error";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("subslash_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("subslash_session_id", id);
  }
  return id;
}

const STAGE_LABELS: Record<UploadStage, string> = {
  idle: "",
  uploading: "Uploading your statement…",
  parsing: "Analyzing your statement…",
  done: "Analysis complete! Redirecting…",
  error: "Something went wrong",
};

export default function UploadPage() {
  const router = useRouter();
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setStage("uploading");
        setProgress(0);
        setErrorMsg("");

        const sessionId = getSessionId();

        // Step 1: Upload file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("session_id", sessionId);

        const xhr = new XMLHttpRequest();
        const uploadResult = await new Promise<{ upload_id: string }>(
          (resolve, reject) => {
            xhr.upload.addEventListener("progress", (e) => {
              if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
              }
            });

            xhr.addEventListener("load", () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
              } else {
                const body = JSON.parse(xhr.responseText);
                reject(new Error(body.error || "Upload failed"));
              }
            });

            xhr.addEventListener("error", () =>
              reject(new Error("Network error during upload"))
            );

            xhr.open("POST", "/api/upload");
            xhr.send(formData);
          }
        );

        // Step 2: Parse the uploaded PDF
        setStage("parsing");
        setProgress(0);

        const parseRes = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ upload_id: uploadResult.upload_id }),
        });

        if (!parseRes.ok) {
          const body = await parseRes.json();
          throw new Error(body.error || "Failed to parse statement");
        }

        // Step 3: Redirect to dashboard
        setStage("done");
        setProgress(100);

        await new Promise((r) => setTimeout(r, 800));
        router.push(`/dashboard?upload_id=${uploadResult.upload_id}`);
      } catch (err) {
        setStage("error");
        setErrorMsg(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    },
    [router]
  );

  const isProcessing = stage === "uploading" || stage === "parsing";

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ff88]/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 pt-16">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-1.5 self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Upload Your Statement
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            We&apos;ll scan it for recurring subscriptions in seconds
          </p>
        </div>

        {/* Upload zone or processing state */}
        {!isProcessing && stage !== "done" ? (
          <UploadZone onFileSelect={handleUpload} disabled={false} />
        ) : (
          <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12">
            {stage === "done" ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/15">
                <ShieldCheck className="h-8 w-8 text-[#00ff88]" />
              </div>
            ) : (
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-2xl bg-[#00ff88]/10" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/10">
                  <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm font-medium text-white">
                {STAGE_LABELS[stage]}
              </p>
              {stage === "parsing" && (
                <p className="mt-1.5 text-xs text-zinc-500">
                  Extracting transactions and detecting subscriptions…
                </p>
              )}
            </div>

            {/* Progress bar */}
            {stage === "uploading" && (
              <div className="w-full max-w-xs">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[#00ff88] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-xs tabular-nums text-zinc-500">
                  {progress}%
                </p>
              </div>
            )}

            {stage === "parsing" && (
              <div className="w-full max-w-xs">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-full animate-pulse rounded-full bg-[#00ff88]/40" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {stage === "error" && (
          <div className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-center">
            <p className="text-sm text-red-400">{errorMsg}</p>
            <button
              type="button"
              onClick={() => {
                setStage("idle");
                setErrorMsg("");
              }}
              className="mt-3 rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* Privacy footer */}
        <div className="mt-8 flex items-center gap-2 text-zinc-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          <p className="text-xs">
            Your statement is processed securely and never shared with anyone
          </p>
        </div>
      </div>
    </main>
  );
}
