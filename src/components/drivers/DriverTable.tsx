"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updateDriverStatus } from "@/actions/driver.actions";

const statusColors = {
  AVAILABLE: "bg-green-500/20 text-green-500 border border-green-500",
  ON_TRIP: "bg-blue-500/20 text-blue-500 border border-blue-500",
  OFF_DUTY: "bg-gray-500/20 text-gray-400 border border-gray-500",
  SUSPENDED: "bg-orange-500/20 text-orange-500 border border-orange-500",
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
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/50">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Driver</th>
              <th scope="col" className="px-6 py-4 font-medium">License No.</th>
              <th scope="col" className="px-6 py-4 font-medium">Category</th>
              <th scope="col" className="px-6 py-4 font-medium">Expiry</th>
              <th scope="col" className="px-6 py-4 font-medium">Contact</th>
              <th scope="col" className="px-6 py-4 font-medium text-center">Trip Compl.</th>
              <th scope="col" className="px-6 py-4 font-medium text-center">Safety</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => {
              const isExpired = new Date(driver.licenseExpiry) < new Date();
              const tripsCompleted = driver.trips?.length || 0;

              return (
                <tr key={driver.id} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/drivers/${driver.id}`} className="hover:underline font-medium text-white transition-colors">
                      {driver.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{driver.licenseNumber}</td>
                  <td className="px-6 py-4">{driver.licenseCategory}</td>
                  <td className="px-6 py-4">
                    <span className={isExpired ? "text-red-400 font-medium flex items-center gap-2" : ""}>
                      {isExpired && (
                        <span className="text-xs font-bold uppercase tracking-wider text-red-500">Expired</span>
                      )}
                      {new Date(driver.licenseExpiry).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">{driver.contact}</td>
                  <td className="px-6 py-4 text-center">{tripsCompleted}</td>
                  <td className="px-6 py-4 text-center">{driver.safetyScore}%</td>
                  <td className="px-6 py-4">
                    <select
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer outline-none appearance-none ${statusColors[driver.status as keyof typeof statusColors]}`}
                      value={driver.status}
                      onChange={(e) => handleStatusChange(driver.id, e.target.value as "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED")}
                      disabled={isPending}
                    >
                      {Object.keys(statusLabels).map((status) => (
                        <option key={status} value={status} className="bg-gray-900 text-gray-200">
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
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Toggle Status</div>
        <div className="flex gap-3">
          {Object.entries(statusLabels).map(([key, label]) => (
            <div key={key} className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider ${statusColors[key as keyof typeof statusColors]}`}>
              {label}
            </div>
          ))}
        </div>
        <div className="text-sm text-orange-500/80 mt-2">
          Rule: Expired license or Suspended status → blocked from trip assignment
        </div>
      </div>
    </div>
  );
}
