"use client";

import { useTransition } from "react";
import { dispatchTrip, completeTrip, cancelTrip } from "@/actions/trip.actions";
import Link from "next/link";

const statusColors = {
  DRAFT: "bg-surface text-text-subtle border-surface-border",
  DISPATCHED: "bg-status-on-trip text-white border-transparent shadow-sm",
  COMPLETED: "bg-status-available text-white border-transparent shadow-sm",
  CANCELLED: "bg-status-retired text-white border-transparent shadow-sm",
};

interface TripWithRelations {
  id: string;
  status: string;
  vehicleId: string;
  driverId: string;
  source: string;
  destination: string;
  vehicle: { regNumber: string; name?: string };
  driver: { name: string };
}

export default function LiveBoard({ trips }: { trips: TripWithRelations[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDispatch = (id: string) => {
    if (confirm("Are you sure you want to dispatch this trip?")) {
      startTransition(async () => {
        await dispatchTrip(id);
      });
    }
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this trip?")) {
      startTransition(async () => {
        await cancelTrip(id);
      });
    }
  };

  const handleComplete = (id: string) => {
    const odo = prompt("Enter final vehicle odometer reading (km):");
    if (!odo) return;
    
    const fuel = prompt("Enter total fuel consumed (liters):");
    if (!fuel) return;

    startTransition(async () => {
      const res = await completeTrip(id, Number(odo), Number(fuel));
      if (res && typeof res === 'object' && 'error' in res && typeof res.error === 'string') alert(res.error);
    });
  };

  return (
    <div className="bg-transparent h-full flex flex-col gap-4">
      <div className="px-1">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest">LIVE BOARD</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {trips.length === 0 ? (
          <div className="text-sm text-text-muted p-4">No active trips.</div>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className="relative bg-surface border border-surface-border rounded-xl p-5 shadow-sm hover:border-surface-hover transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link href={`/trips/${trip.id}`} className="font-mono text-sm font-bold text-white tracking-widest uppercase hover:text-brand-primary transition-colors">
                    TR {trip.id.substring(trip.id.length - 4)}
                  </Link>
                </div>
                <div className="text-xs font-medium text-text-muted flex items-center gap-2">
                  <Link href={`/vehicles/${trip.vehicleId}`} className="hover:text-white transition-colors">{trip.vehicle.regNumber}</Link>
                  <span>/</span>
                  <Link href={`/drivers/${trip.driverId}`} className="hover:text-white transition-colors uppercase">{trip.driver.name}</Link>
                </div>
              </div>

              <div className="text-sm text-white font-medium mb-4">
                {trip.source} <span className="text-text-muted mx-1">→</span> {trip.destination}
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${statusColors[trip.status as keyof typeof statusColors]}`}>
                  {trip.status}
                </span>

                <div className="flex items-center gap-2">
                  {trip.status === "DRAFT" && (
                    <>
                      <button 
                        onClick={() => handleCancel(trip.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleDispatch(trip.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-md shadow-sm transition-colors"
                      >
                        Dispatch
                      </button>
                    </>
                  )}
                  {trip.status === "DISPATCHED" && (
                    <>
                      <button 
                        onClick={() => handleCancel(trip.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-semibold text-status-retired hover:bg-status-retired/10 rounded-md transition-colors"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={() => handleComplete(trip.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-status-available hover:bg-status-available/80 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
                      >
                        Complete Trip
                      </button>
                    </>
                  )}
                  {(trip.status === "CANCELLED" || trip.status === "COMPLETED") && (
                    <span className="text-xs text-text-muted font-medium">
                      {trip.status === "COMPLETED" ? "Vehicle & Driver Available" : "Vehicle went to shop / Cancelled"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
