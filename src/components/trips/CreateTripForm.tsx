"use client";

import { useState, useTransition, useMemo } from "react";
import { createTrip } from "@/actions/trip.actions";
import { checkCapacity } from "@/domain/trip-rules";

type Vehicle = { id: string; regNumber: string; maxLoadKg: number; name: string };
type Driver = { id: string; name: string; licenseCategory: string };

import { useRouter } from "next/navigation";

export default function CreateTripForm({
  vehicles,
  drivers
}: {
  vehicles: Vehicle[];
  drivers: Driver[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  const capacityCheck = useMemo(() => {
    if (!selectedVehicle || !cargoWeight) return { valid: true };
    return checkCapacity(selectedVehicle, Number(cargoWeight));
  }, [selectedVehicle, cargoWeight]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!capacityCheck.valid) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      source: formData.get("source") as string,
      destination: formData.get("destination") as string,
      vehicleId: formData.get("vehicleId") as string,
      driverId: formData.get("driverId") as string,
      cargoWeight: Number(formData.get("cargoWeight")),
      plannedDistance: Number(formData.get("plannedDistance")),
    };

    startTransition(async () => {
      const result = await createTrip(data);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/trips");
      }
    });
  };

  return (
    <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="border-b border-surface-border px-6 py-5 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white tracking-tight">CREATE TRIP</h2>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Source</label>
            <input 
              required 
              name="source" 
              type="text" 
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary shadow-sm" 
              placeholder="e.g. Gandhinagar Depot" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Destination</label>
            <input 
              required 
              name="destination" 
              type="text" 
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary shadow-sm" 
              placeholder="e.g. Ahmedabad Hub" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Vehicle (Available Only)</label>
            <select 
              required 
              name="vehicleId" 
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary appearance-none shadow-sm"
            >
              <option value="" disabled>Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.regNumber}) — {v.maxLoadKg} kg capacity
                </option>
              ))}
            </select>
            {vehicles.length === 0 && <p className="text-xs text-status-retired mt-1">No vehicles available.</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Driver (Available Only)</label>
            <select 
              required 
              name="driverId" 
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary appearance-none shadow-sm"
            >
              <option value="" disabled defaultValue="">Select Driver</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.licenseCategory}
                </option>
              ))}
            </select>
            {drivers.length === 0 && <p className="text-xs text-status-retired mt-1">No drivers available.</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Cargo Weight (KG)</label>
            <input 
              required 
              name="cargoWeight" 
              type="number" 
              value={cargoWeight}
              onChange={(e) => setCargoWeight(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary shadow-sm" 
              placeholder="700" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-1">Planned Distance (KM)</label>
            <input 
              required 
              name="plannedDistance" 
              type="number" 
              className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary shadow-sm" 
              placeholder="38" 
            />
          </div>

          {/* Validation Feedback */}
          {selectedVehicle && cargoWeight && (
             <div className={`p-4 border rounded-xl text-sm ${!capacityCheck.valid ? 'bg-red-500/10 border-red-500/30' : 'bg-surface border-surface-border'}`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-text-muted">
                    <span>Vehicle Capacity:</span>
                    <span className="font-mono text-white">{selectedVehicle.maxLoadKg} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-text-muted">
                    <span>Cargo Weight:</span>
                    <span className="font-mono text-white">{cargoWeight} kg</span>
                  </div>
                  {!capacityCheck.valid && (
                    <div className="mt-2 text-red-400 font-semibold flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      {capacityCheck.error}
                    </div>
                  )}
                </div>
             </div>
          )}

          <div className="mt-4 flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending || !capacityCheck.valid}
              className={`flex-1 py-3 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                !capacityCheck.valid ? 'bg-surface-hover text-text-muted cursor-not-allowed border border-surface-border' : 'bg-brand-primary hover:bg-brand-primary-hover shadow-sm'
              }`}
            >
              {isPending ? "Creating..." : !capacityCheck.valid ? "Dispatch (disabled)" : "Create Trip"}
            </button>
            <button
              type="reset"
              onClick={() => { setCargoWeight(""); setSelectedVehicleId(""); }}
              className="px-6 py-3 bg-surface border border-surface-border hover:bg-surface-hover text-text-subtle text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
