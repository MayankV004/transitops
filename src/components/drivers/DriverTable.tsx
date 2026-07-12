"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updateDriverStatus } from "@/actions/driver.actions";

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

export default function DriverTable({ drivers }: { drivers: Array<{
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  contact: string;
  safetyScore: number;
  status: string;
  trips?: { id: string }[];
}> }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (driverId: string, newStatus: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED") => {
    startTransition(async () => {
      await updateDriverStatus(driverId, newStatus);
    });
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-surface-border bg-surface shadow-sm">
        <table className="w-full text-sm text-left text-text-muted">
          <thead className="text-[11px] uppercase tracking-widest bg-surface-hover/50 border-b border-surface-border text-text-muted font-semibold">
            <tr>
              <th scope="col" className="px-8 py-5">Driver</th>
              <th scope="col" className="px-6 py-5">License No.</th>
              <th scope="col" className="px-6 py-5">Category</th>
              <th scope="col" className="px-6 py-5">Expiry</th>
              <th scope="col" className="px-6 py-5">Contact</th>
              <th scope="col" className="px-6 py-5 text-center">Trip Compl.</th>
              <th scope="col" className="px-6 py-5 text-center">Safety</th>
              <th scope="col" className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {drivers.map((driver) => {
              const isExpired = new Date(driver.licenseExpiry) < new Date();
              const tripsCompleted = driver.trips?.length || 0;

              return (
                <tr key={driver.id} className="hover:bg-surface-hover/30 transition-colors">
                  <td className="px-8 py-5">
                    <Link href={`/drivers/${driver.id}`} className="hover:text-brand-primary font-medium text-foreground transition-colors">
                      {driver.name}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-text-subtle font-medium">{driver.licenseNumber}</td>
                  <td className="px-6 py-5">
                    <span className="bg-surface-hover text-text-subtle px-2.5 py-1 rounded-md text-xs font-medium border border-surface-border">
                      {driver.licenseCategory}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={isExpired ? "text-status-retired font-medium flex items-center gap-2" : "text-text-subtle"}>
                      {isExpired && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-status-retired">Expired</span>
                      )}
                      {new Date(driver.licenseExpiry).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-text-subtle">{driver.contact}</td>
                  <td className="px-6 py-5 text-center font-medium">{tripsCompleted}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`font-semibold ${driver.safetyScore >= 90 ? 'text-status-available' : driver.safetyScore >= 70 ? 'text-status-suspended' : 'text-status-retired'}`}>
                      {driver.safetyScore}%
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer outline-none appearance-none shadow-sm ${statusColors[driver.status as keyof typeof statusColors]}`}
                      value={driver.status}
                      onChange={(e) => handleStatusChange(driver.id, e.target.value as "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED")}
                      disabled={isPending}
                    >
                      {Object.keys(statusLabels).map((status) => (
                        <option key={status} value={status} className="bg-surface text-foreground font-medium">
                          {statusLabels[status as keyof typeof statusLabels]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            
            {drivers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-text-muted">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
