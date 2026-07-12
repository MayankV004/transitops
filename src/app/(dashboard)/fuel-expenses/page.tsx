export default function Page() { 
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fuel & Expenses</h1>
          <p className="text-text-muted text-sm mt-1.5">Record fuel logs and track operational expenses across the fleet.</p>
        </div>
      </div>
    </div>
  );
}
