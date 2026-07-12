import { getTripById } from "@/actions/trip.actions";
import { getSessionOrRedirect } from "@/lib/rbac";
import Link from "next/link";
import { notFound } from "next/navigation";
import TripActions from "@/components/trips/TripActions";

const statusColors = {
  DRAFT: "bg-surface text-text-subtle border-surface-border",
  DISPATCHED: "bg-status-on-trip text-white border-transparent shadow-sm",
  COMPLETED: "bg-status-available text-white border-transparent shadow-sm",
  CANCELLED: "bg-status-retired text-white border-transparent shadow-sm",
};

// Next.js dynamic params
export default async function TripDetailsPage(props: { params: Promise<{ id: string }> }) {
  await getSessionOrRedirect();
  const params = await props.params;

  const trip = await getTripById(params.id);

  if (!trip) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto flex flex-col gap-8 h-full">
      {/* Top Bar with Back Button & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div className="flex items-center gap-4">
          <Link 
            href="/trips" 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface border border-transparent hover:border-surface-border transition-colors text-text-muted hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">TR {trip.id.substring(trip.id.length - 4)}</h1>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${statusColors[trip.status as keyof typeof statusColors]}`}>
                {trip.status}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">Created on {new Date(trip.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <TripActions tripId={trip.id} status={trip.status} />
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route Info */}
        <div className="lg:col-span-2 bg-surface border border-surface-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">Route Info</h2>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="text-xs text-text-muted mb-1">Source</div>
                <div className="text-base font-medium text-white">{trip.source}</div>
              </div>
              <div className="text-brand-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-text-muted mb-1">Destination</div>
                <div className="text-base font-medium text-white">{trip.destination}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-surface-border">
            <div>
              <div className="text-xs text-text-muted mb-1">Cargo Weight</div>
              <div className="text-sm font-mono text-white">{trip.cargoWeight} kg</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Planned Dist.</div>
              <div className="text-sm font-mono text-white">{trip.plannedDistance} km</div>
            </div>
            {trip.actualDistance !== null && (
              <div>
                <div className="text-xs text-text-muted mb-1">Actual Dist.</div>
                <div className="text-sm font-mono text-white">{trip.actualDistance} km</div>
              </div>
            )}
            {trip.fuelConsumed !== null && (
              <div>
                <div className="text-xs text-text-muted mb-1">Fuel Consumed</div>
                <div className="text-sm font-mono text-white">{trip.fuelConsumed} L</div>
              </div>
            )}
          </div>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-6">
          {/* Driver Card */}
          <Link href={`/drivers/${trip.driverId}`} className="block bg-surface border border-surface-border rounded-xl p-5 shadow-sm hover:border-brand-primary transition-colors group">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Assigned Driver</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background border border-surface-border flex items-center justify-center text-white font-bold group-hover:bg-brand-primary group-hover:border-brand-primary transition-colors">
                {trip.driver.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-brand-primary transition-colors">{trip.driver.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{trip.driver.licenseCategory} License</div>
              </div>
            </div>
          </Link>

          {/* Vehicle Card */}
          <Link href={`/vehicles/${trip.vehicleId}`} className="block bg-surface border border-surface-border rounded-xl p-5 shadow-sm hover:border-brand-primary transition-colors group">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Assigned Vehicle</h2>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-brand-primary transition-colors mb-1">{trip.vehicle.name}</div>
              <div className="text-xs text-text-muted flex items-center gap-2">
                <span className="font-mono text-white">{trip.vehicle.regNumber}</span>
                <span>•</span>
                <span>Max {trip.vehicle.maxLoadKg}kg</span>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
