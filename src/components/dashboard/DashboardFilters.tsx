"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "All";
  const status = searchParams.get("status") || "All";
  const region = searchParams.get("region") || "All";

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex gap-4">
      <select
        value={type}
        onChange={(e) => updateFilters("type", e.target.value)}
        className="bg-[#121212] border border-gray-800 text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-gray-600 appearance-none min-w-[140px]"
      >
        <option value="All">Vehicle Type: All</option>
        <option value="Van">Van</option>
        <option value="Truck">Truck</option>
        <option value="Mini">Mini</option>
      </select>
      <select
        value={status}
        onChange={(e) => updateFilters("status", e.target.value)}
        className="bg-[#121212] border border-gray-800 text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-gray-600 appearance-none min-w-[140px]"
      >
        <option value="All">Status: All</option>
        <option value="AVAILABLE">Available</option>
        <option value="ON_TRIP">On Trip</option>
        <option value="IN_SHOP">In Shop</option>
        <option value="RETIRED">Retired</option>
      </select>
      <select
        value={region}
        onChange={(e) => updateFilters("region", e.target.value)}
        className="bg-[#121212] border border-gray-800 text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-gray-600 appearance-none min-w-[140px]"
      >
        <option value="All">Region: All</option>
        <option value="North">North</option>
        <option value="South">South</option>
        <option value="East">East</option>
        <option value="West">West</option>
      </select>
    </div>
  );
}
