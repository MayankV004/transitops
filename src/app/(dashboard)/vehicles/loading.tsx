export default function TableLoading() {
  return (
    <div className="page-container animate-pulse">
      {/* Top bar skeleton */}
      <div className="top-bar">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-64 h-10 bg-surface rounded-lg"></div>
          <div className="w-36 h-10 bg-brand-primary/20 rounded-lg"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-4 bg-surface rounded"></div>
          <div className="w-10 h-10 bg-surface rounded-full"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i}><div className="w-20 h-3 bg-surface rounded"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, row) => (
              <tr key={row}>
                {Array.from({ length: 6 }).map((_, col) => (
                  <td key={col}>
                    <div className={`h-4 bg-surface/60 rounded ${col === 0 ? 'w-24' : col === 3 ? 'w-20' : 'w-16'}`}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
