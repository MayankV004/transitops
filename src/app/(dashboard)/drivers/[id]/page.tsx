import { getDriverById } from "@/actions/driver.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrRedirect } from "@/lib/rbac";

const statusColors = {
  AVAILABLE: "bg-status-available text-white border-transparent",
  ON_TRIP: "bg-status-on-trip text-white border-transparent",
  OFF_DUTY: "bg-text-muted text-white border-transparent",
  SUSPENDED: "bg-status-suspended text-white border-transparent",
};

const statusLabels = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await getSessionOrRedirect();
  const { id } = await params;
  const driver = await getDriverById(id);

  if (!driver) {
    notFound();
  }

  const activeTripsCount = driver.trips.filter(t => t.status === 'DISPATCHED' || t.status === 'DRAFT').length;
  const completedTripsCount = driver.trips.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-8 p-4 lg:p-8    mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/drivers" className="text-text-muted hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white">{driver.name}</h1>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ml-2 shadow-sm ${statusColors[driver.status as keyof typeof statusColors]}`}>
              {statusLabels[driver.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p className="text-text-muted ml-9 text-sm">Driver ID: <span className="font-mono text-text-subtle">{driver.id}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-surface-border px-6 py-5">
              <h2 className="text-lg font-semibold text-white tracking-tight">Driver Profile</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">License Number</p>
                <p className="text-white font-medium">{driver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">License Category</p>
                <p className="text-white font-medium">{driver.licenseCategory}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">License Expiry</p>
                <p className="text-white font-medium">{new Date(driver.licenseExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Contact</p>
                <p className="text-white font-medium">{driver.contact}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Safety Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-white">{driver.safetyScore}</p>
                  <p className="text-text-muted pb-1">/ 100</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full border-4 flex items-center justify-center border-[#10b981]/20">
                <span className="text-[#10b981] font-bold text-lg">
                  {driver.safetyScore >= 90 ? 'A+' : driver.safetyScore >= 80 ? 'A' : driver.safetyScore >= 70 ? 'B' : 'C'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Trip History */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden h-full">
            <div className="border-b border-surface-border px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white tracking-tight">Trip History</h2>
              <div className="text-sm text-text-muted bg-surface-hover px-3 py-1.5 rounded-full border border-surface-border">
                <span className="text-white font-medium">{completedTripsCount}</span> completed · <span className="text-white font-medium">{activeTripsCount}</span> active
              </div>
            </div>
            
            <div className="p-0">
              {driver.trips.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-text-muted">No trips recorded for this driver yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-hover/50 border-b border-surface-border">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Route</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Vehicle</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {driver.trips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-surface-hover/30 transition-colors">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{trip.source}</span>
                              <span className="text-text-muted">→</span>
                              <span className="font-medium text-foreground">{trip.destination}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-text-subtle font-medium">
                            {new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4.5 text-text-subtle">
                            <Link href={`/vehicles/${trip.vehicleId}`} className="text-brand-primary font-medium hover:underline transition-all">
                              {trip.vehicle.regNumber}
                            </Link>
                          </td>
                          <td className="px-6 py-4.5">
                            <span className="bg-surface-hover text-text-subtle px-2.5 py-1 rounded-md text-xs font-medium border border-surface-border capitalize shadow-sm">
                              {trip.status.toLowerCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
