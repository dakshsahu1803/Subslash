"use client";

import { useCallback, useState } from "react";
import { CloudUpload, FileText, X, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SUPPORTED_BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak"];

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);

      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be under 10MB");
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [disabled, validateAndSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          group relative flex cursor-pointer flex-col items-center justify-center
          rounded-2xl border-2 border-dashed p-12 transition-all duration-300
          ${disabled ? "pointer-events-none opacity-50" : ""}
          ${
            isDragging
              ? "border-[#00ff88] bg-[#00ff88]/[0.04] shadow-[0_0_40px_rgba(0,255,136,0.12)]"
              : "border-white/10 bg-white/[0.02] hover:border-[#00ff88]/50 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(0,255,136,0.06)]"
          }
        `}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff88]/10">
              <FileText className="h-7 w-7 text-[#00ff88]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {formatSize(selectedFile.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearFile();
              }}
              className="mt-2 flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
                isDragging
                  ? "bg-[#00ff88]/15"
                  : "bg-white/[0.04] group-hover:bg-[#00ff88]/10"
              }`}
            >
              <CloudUpload
                className={`h-8 w-8 transition-colors duration-300 ${
                  isDragging
                    ? "text-[#00ff88]"
                    : "text-zinc-500 group-hover:text-[#00ff88]"
                }`}
                strokeWidth={1.5}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-white">
                Drop your bank statement here
              </p>
              <p className="mt-1.5 text-xs text-zinc-500">
                or{" "}
                <span className="text-[#00ff88] underline underline-offset-2">
                  browse files
                </span>{" "}
                &middot; PDF only &middot; Max 10MB
              </p>
            </div>

            {/* Supported banks */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                Supports
              </span>
              <div className="flex gap-1.5">
                {SUPPORTED_BANKS.map((bank) => (
                  <span
                    key={bank}
                    className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                  >
                    {bank}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </label>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
