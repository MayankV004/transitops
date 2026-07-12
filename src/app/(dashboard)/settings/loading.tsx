export default function SettingsLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="w-48 h-8 bg-surface rounded"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Left column - Form */}
        <div className="space-y-6">
          <div className="w-16 h-3 bg-surface rounded"></div>
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="w-24 h-3 bg-surface rounded"></div>
                <div className="w-full h-10 bg-surface rounded-md border border-surface-border"></div>
              </div>
            ))}
            <div className="w-28 h-10 bg-brand-primary/20 rounded-md mt-4"></div>
          </div>
        </div>

        {/* Right column - RBAC */}
        <div className="space-y-6">
          <div className="w-40 h-3 bg-surface rounded"></div>
          <div className="table-container">
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-6">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className={`h-4 bg-surface/60 rounded ${j === 0 ? 'w-28' : 'w-8'}`}></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
