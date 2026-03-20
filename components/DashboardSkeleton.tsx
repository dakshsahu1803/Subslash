export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-white/5" />
              <div className="h-3 w-20 rounded bg-white/5" />
            </div>
            <div className="mt-3 h-7 w-24 rounded bg-white/5" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cards */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-white/5" />
                  <div className="h-3 w-48 rounded bg-white/5" />
                </div>
                <div className="h-5 w-16 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart placeholders */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5">
            <div className="mb-4 h-3 w-28 rounded bg-white/5" />
            <div className="mx-auto h-[160px] w-[160px] rounded-full border-[16px] border-white/5" />
          </div>
          <div className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5">
            <div className="mb-4 h-3 w-36 rounded bg-white/5" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-16 rounded bg-white/5" />
                  <div
                    className="h-4 rounded bg-white/5"
                    style={{ width: `${80 - i * 15}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 rounded-xl border border-[#1a1a1a] bg-[#111111] p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/5" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded bg-white/5" />
            <div className="h-3 w-64 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
