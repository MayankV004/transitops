export default function Page() { 
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trip Management</h1>
          <p className="text-text-muted text-sm mt-1.5">Create, dispatch, and track active trips across your fleet.</p>
        </div>
      </div>
    </div>
  );
}
