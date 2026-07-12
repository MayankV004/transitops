export default function Page() { 
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-text-muted text-sm mt-1.5">View fleet utilization, operational costs, and ROI metrics.</p>
        </div>
      </div>
    </div>
  );
}
