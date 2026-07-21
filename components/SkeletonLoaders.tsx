export function ProposalSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-800 rounded-lg" />
        <div className="h-6 w-16 bg-slate-800 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
      <div className="h-12 w-full bg-slate-800/60 rounded-xl" />
      <div className="flex justify-between border-t border-slate-800/80 pt-4">
        <div className="h-4 w-28 bg-slate-800 rounded-lg" />
        <div className="h-4 w-24 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-8 w-32 bg-slate-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
