"use client";

import LogFuelModal from "./LogFuelModal";
import AddExpenseModal from "./AddExpenseModal";
import type { FuelLog, Expense, MaintenanceLog, Vehicle, Trip } from "@/generated/prisma/client";
import { useMemo } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";

type FuelExpenseBoardProps = {
  fuelLogs: (FuelLog & { vehicle: Vehicle })[];
  expenses: (Expense & { vehicle: Vehicle, trip: Trip | null })[];
  maintenanceLogs: (MaintenanceLog & { vehicle: Vehicle })[];
  vehicles: Vehicle[];
  recentTrips: Trip[];
  canManage: boolean;
  totalOperationalCost: number;
};

export default function FuelExpenseBoard({
  fuelLogs,
  expenses,
  maintenanceLogs,
  vehicles,
  recentTrips,
  canManage,
  totalOperationalCost
}: FuelExpenseBoardProps) {
  const { currencySymbol } = useSettings();
  
  // Aggregate expenses and maintenance logs by Vehicle (or Trip) for the "OTHER EXPENSES" table
  // We'll create a row for each Vehicle that has expenses or maintenance
  const aggregatedExpenses = useMemo(() => {
    const map = new Map<string, {
      id: string; // vehicle id or trip id
      tripId?: string;
      tripStatus?: string;
      vehicleName: string;
      toll: number;
      other: number;
      maintenance: number;
      status: string;
    }>();

    // Add Expenses
    expenses.forEach(exp => {
      // Group by tripId if it exists, else vehicleId
      const key = exp.tripId ? `trip-${exp.tripId}` : `vehicle-${exp.vehicleId}`;
      
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          tripId: exp.tripId ? `TR ${exp.tripId.slice(-4).toUpperCase()}` : "-",
          tripStatus: exp.trip?.status,
          vehicleName: `${exp.vehicle.name} (${exp.vehicle.regNumber})`,
          toll: 0,
          other: 0,
          maintenance: 0,
          status: exp.trip ? exp.trip.status : exp.vehicle.status,
        });
      }

      const row = map.get(key)!;
      if (exp.type.toLowerCase() === "toll") {
        row.toll += exp.amount;
      } else {
        row.other += exp.amount;
      }
    });

    // Add Maintenance (links to vehicle)
    maintenanceLogs.forEach(ml => {
      const key = `vehicle-${ml.vehicleId}`;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          tripId: "-",
          vehicleName: `${ml.vehicle.name} (${ml.vehicle.regNumber})`,
          toll: 0,
          other: 0,
          maintenance: 0,
          status: ml.vehicle.status,
        });
      }
      const row = map.get(key)!;
      row.maintenance += ml.cost;
    });

    return Array.from(map.values());
  }, [expenses, maintenanceLogs]);

  return (
    <div className="space-y-12">
      {/* FUEL LOGS SECTION */}
      <section className="space-y-4">
        <div className="flex justify-between items-end border-b border-surface-border pb-2">
          <h2 className="text-sm font-semibold text-text-muted tracking-widest uppercase">Fuel Logs</h2>
          {canManage && (
            <div className="flex gap-3">
              <LogFuelModal vehicles={vehicles} />
              <AddExpenseModal vehicles={vehicles} recentTrips={recentTrips} />
            </div>
          )}
        </div>
        
        <div className="table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-xs uppercase text-text-muted tracking-wider">
                <th className="py-4 px-4 font-medium">Vehicle</th>
                <th className="py-4 px-4 font-medium">Date</th>
                <th className="py-4 px-4 font-medium">Liters</th>
                <th className="py-4 px-4 font-medium">Fuel Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {fuelLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted italic">No fuel logs found</td>
                </tr>
              ) : (
                fuelLogs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-hover transition-colors group">
                    <td className="py-4 px-4 font-medium text-white">
                      {log.vehicle.name} <span className="text-text-muted font-normal text-sm">({log.vehicle.regNumber})</span>
                    </td>
                    <td className="py-4 px-4 text-text-muted">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-white">
                      {log.liters.toLocaleString()} <span className="text-text-muted text-xs">L</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-brand-primary">
                      {currencySymbol}{log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* OTHER EXPENSES SECTION */}
      <section className="space-y-4">
        <div className="border-b border-surface-border pb-2">
          <h2 className="text-sm font-semibold text-text-muted tracking-widest uppercase">Other Expenses (Toll / Misc / Maint)</h2>
        </div>
        
        <div className="table-container">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-xs uppercase text-text-muted tracking-wider">
                <th className="py-4 px-4 font-medium">Trip</th>
                <th className="py-4 px-4 font-medium">Vehicle</th>
                <th className="py-4 px-4 font-medium">Toll</th>
                <th className="py-4 px-4 font-medium">Other</th>
                <th className="py-4 px-4 font-medium">Maint. (Linked)</th>
                <th className="py-4 px-4 font-medium text-right">Total</th>
                <th className="py-4 px-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {aggregatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted italic">No expenses found</td>
                </tr>
              ) : (
                aggregatedExpenses.map(row => {
                  const total = row.toll + row.other + row.maintenance;
                  return (
                    <tr key={row.id} className="hover:bg-surface-hover transition-colors group">
                      <td className="py-4 px-4 font-mono text-sm text-text-muted">
                        {row.tripId}
                      </td>
                      <td className="py-4 px-4 font-medium text-white">
                        {row.vehicleName}
                      </td>
                      <td className="py-4 px-4 text-white">
                        {row.toll > 0 ? `${currencySymbol}${row.toll.toLocaleString()}` : <span className="text-zinc-700">-</span>}
                      </td>
                      <td className="py-4 px-4 text-white">
                        {row.other > 0 ? `${currencySymbol}${row.other.toLocaleString()}` : <span className="text-zinc-700">-</span>}
                      </td>
                      <td className="py-4 px-4 text-white">
                        {row.maintenance > 0 ? `${currencySymbol}${row.maintenance.toLocaleString()}` : <span className="text-zinc-700">-</span>}
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-white text-right">
                        {currencySymbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          row.status === 'AVAILABLE' || row.status === 'COMPLETED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : row.status === 'ON_TRIP' || row.status === 'DISPATCHED'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TOTAL FOOTER */}
        <div className="mt-8 flex items-center justify-between border-t-2 border-white/20 pt-6">
          <div className="text-sm font-semibold text-text-muted tracking-widest uppercase">
            Total Operational Cost (Auto) = Fuel + Maintenance
          </div>
          <div className="text-2xl font-bold font-mono text-brand-primary">
            {currencySymbol}{totalOperationalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </section>
    </div>
  );
}
