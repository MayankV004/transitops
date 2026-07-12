export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-full animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-48 h-10 bg-surface rounded-lg"></div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-5 bg-surface rounded"></div>
          <div className="w-32 h-8 bg-surface rounded-full"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="w-40 h-7 bg-surface rounded mb-6"></div>

      {/* Filter Skeleton */}
      <div className="mb-6">
        <div className="w-16 h-3 bg-surface rounded mb-2"></div>
        <div className="flex gap-3">
          <div className="w-32 h-9 bg-surface rounded-lg border border-surface-border"></div>
          <div className="w-32 h-9 bg-surface rounded-lg border border-surface-border"></div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800"></div>
            <div className="w-24 h-3 bg-surface rounded mb-4 ml-2"></div>
            <div className="w-10 h-7 bg-surface rounded ml-2"></div>
          </div>
        ))}
      </div>

      {/* Table + Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="w-24 h-3 bg-surface rounded mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-6 items-center">
                <div className="w-16 h-4 bg-surface rounded"></div>
                <div className="w-24 h-4 bg-surface rounded"></div>
                <div className="w-20 h-4 bg-surface rounded"></div>
                <div className="w-20 h-6 bg-surface rounded"></div>
                <div className="w-16 h-4 bg-surface rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="w-28 h-3 bg-surface rounded mb-4"></div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="w-24 h-3 bg-surface rounded mb-2"></div>
                <div className="w-full bg-[#1e1e1e] rounded-full h-2.5"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
