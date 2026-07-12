export default function TripsLoading() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto flex flex-col gap-8 animate-pulse">
      {/* Top Bar */}
      <div className="flex justify-between items-center pb-6 border-b border-surface-border">
        <div className="flex items-center gap-4">
          <div className="w-96 h-10 bg-surface rounded-lg border border-surface-border"></div>
          <div className="w-32 h-10 bg-brand-primary/20 rounded-lg"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-4 bg-surface rounded"></div>
          <div className="w-10 h-10 bg-surface rounded-full"></div>
        </div>
      </div>

      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-20 h-5 bg-surface-hover rounded"></div>
              <div className="w-24 h-6 bg-blue-500/20 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-40 h-4 bg-surface-hover rounded"></div>
              <div className="w-32 h-4 bg-surface-hover rounded"></div>
            </div>
            <div className="flex gap-2 pt-2">
              <div className="w-24 h-8 bg-surface-hover rounded-lg"></div>
              <div className="w-24 h-8 bg-surface-hover rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
