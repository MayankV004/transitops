"use client";

import { useTransition } from "react";
import { dispatchTrip, completeTrip, cancelTrip } from "@/actions/trip.actions";
import { useRouter } from "next/navigation";

export default function TripActions({ tripId, status }: { tripId: string, status: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDispatch = () => {
    if (confirm("Are you sure you want to dispatch this trip?")) {
      startTransition(async () => {
        await dispatchTrip(tripId);
        router.refresh();
      });
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this trip?")) {
      startTransition(async () => {
        await cancelTrip(tripId);
        router.refresh();
      });
    }
  };

  const handleComplete = () => {
    const odo = prompt("Enter final vehicle odometer reading (km):");
    if (!odo) return;
    
    const fuel = prompt("Enter total fuel consumed (liters):");
    if (!fuel) return;

    startTransition(async () => {
      const res = await completeTrip(tripId, Number(odo), Number(fuel));
      if (res && typeof res === 'object' && 'error' in res && typeof res.error === 'string') alert(res.error);
      router.refresh();
    });
  };

  if (status === "DRAFT") {
    return (
      <div className="flex gap-4">
        <button 
          onClick={handleCancel}
          disabled={isPending}
          className="px-5 py-2.5 bg-surface hover:bg-surface-hover border border-surface-border text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleDispatch}
          disabled={isPending}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          Dispatch Trip
        </button>
      </div>
    );
  }

  if (status === "DISPATCHED") {
    return (
      <div className="flex gap-4">
        <button 
          onClick={handleCancel}
          disabled={isPending}
          className="px-5 py-2.5 bg-surface hover:bg-surface-hover border border-surface-border text-status-retired text-sm font-semibold rounded-lg transition-colors"
        >
          Abort Trip
        </button>
        <button 
          onClick={handleComplete}
          disabled={isPending}
          className="px-5 py-2.5 bg-status-available hover:bg-status-available/80 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          Complete Trip
        </button>
      </div>
    );
  }

  return null;
}
