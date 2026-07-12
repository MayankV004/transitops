export default function FuelExpensesLoading() {
  return (
    <div className="page-container animate-pulse">
      {/* Top bar */}
      <div className="top-bar">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-64 h-10 bg-surface rounded-lg"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-28 h-10 bg-brand-primary/20 rounded-lg"></div>
          <div className="w-28 h-10 bg-surface rounded-lg border border-surface-border"></div>
        </div>
      </div>

      {/* Two-column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Fuel Logs */}
        <div className="table-container">
          <div className="p-4 border-b border-surface-border">
            <div className="w-24 h-4 bg-surface rounded"></div>
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-24 h-4 bg-surface/60 rounded"></div>
                <div className="w-16 h-4 bg-surface/60 rounded"></div>
                <div className="w-20 h-4 bg-surface/60 rounded"></div>
                <div className="w-24 h-4 bg-surface/60 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses */}
        <div className="table-container">
          <div className="p-4 border-b border-surface-border">
            <div className="w-24 h-4 bg-surface rounded"></div>
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-24 h-4 bg-surface/60 rounded"></div>
                <div className="w-16 h-4 bg-surface/60 rounded"></div>
                <div className="w-20 h-4 bg-surface/60 rounded"></div>
                <div className="w-24 h-4 bg-surface/60 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
