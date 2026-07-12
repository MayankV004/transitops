export default function ReportsLoading() {
  return (
    <div className="p-6 max-w-full animate-pulse">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-48 h-10 bg-surface rounded-lg"></div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-5 bg-surface rounded"></div>
          <div className="w-32 h-8 bg-surface rounded-full"></div>
        </div>
      </div>

      {/* Title */}
      <div className="w-48 h-7 bg-surface rounded mb-6"></div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#121212] border border-gray-800 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800"></div>
            <div className="w-28 h-3 bg-surface rounded mb-4 ml-2"></div>
            <div className="w-20 h-7 bg-surface rounded ml-2"></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        <div>
          <div className="w-32 h-3 bg-surface rounded mb-6"></div>
          <div className="flex items-end gap-2 h-48">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                <div className="w-full bg-[#1a2540] rounded-sm" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                <div className="w-8 h-3 bg-surface rounded mt-2"></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="w-36 h-3 bg-surface rounded mb-6"></div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-20 h-3 bg-surface rounded"></div>
                <div className="flex-1 bg-[#1e1e1e] h-4 rounded-sm"></div>
                <div className="w-16 h-3 bg-surface rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
