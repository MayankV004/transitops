import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ROLE_LABELS } from "@/lib/rbac-client";
import { getDepotSettings } from "@/actions/settings.actions";
import { getReportsData } from "@/actions/reports.actions";
import { formatDistanceUnit, extractCurrencySymbol } from "@/lib/settings";
import { ExportPDFButton } from "@/components/ui/ExportPDFButton";

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as { id: string; name: string; email: string; role?: string } | undefined;
  
  const userName = user?.name || "Guest User";
  const userRole = (user?.role || "DISPATCHER") as keyof typeof ROLE_LABELS;
  const roleDisplay = ROLE_LABELS[userRole] || userRole;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const [settings, data] = await Promise.all([
    getDepotSettings(),
    getReportsData(),
  ]);

  const currencySymbol = extractCurrencySymbol(settings.currency);
  const distanceUnit = formatDistanceUnit(settings.distanceUnit);

  const {
    fuelEfficiency,
    fleetUtilization,
    operationalCost,
    vehicleROI,
    monthsData,
    maxRevenue,
    sortedVehicles,
    maxVehicleCost,
  } = data;

  const colors = ['bg-red-400', 'bg-orange-500', 'bg-blue-500'];

  return (
    <div className="p-6 max-w-full">
      {/* Top Bar matching the image */}
      <div className="flex justify-between items-center mb-8">
        <ExportPDFButton />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{userName}</span>
          <span className="px-3 py-1 bg-[#1e293b] text-blue-400 border border-blue-900/50 rounded-full text-xs font-medium flex items-center gap-2">
            {roleDisplay} <span className="bg-blue-500/20 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">{initials}</span>
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-wide mb-6">Reports & Analytics</h1>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          
          <div className="bg-[#121212] border border-gray-800 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Fuel Efficiency</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">{fuelEfficiency} <span className="text-sm text-gray-500">{distanceUnit}/l</span></p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Fleet Utilization</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">{fleetUtilization}%</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Operational Cost</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">{currencySymbol}{operationalCost.toLocaleString()}</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Vehicle ROI</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">{vehicleROI}%</p>
          </div>

        </div>

        <p className="text-xs text-gray-600 mb-12">ROI = (Revenue - (Maintenance + Fuel + Expenses)) / Acquisition Cost</p>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
          
          {/* Monthly Revenue Chart */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-6">Monthly Revenue</h2>
            <div className="flex items-end gap-2 h-48 pt-6">
              {monthsData.map((monthData, index) => {
                const heightPct = Math.max((monthData.revenue / maxRevenue) * 100, 5);
                return (
                  <div key={index} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                      {currencySymbol}{monthData.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    {/* Bar Wrapper */}
                    <div className="w-full flex-1 flex flex-col justify-end">
                      <div 
                        className="w-full bg-[#5c8bc0] rounded-sm transition-all duration-300 border border-blue-900/30"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    {/* Month Label */}
                    <span className="text-[10px] text-gray-500 mt-2 uppercase h-4 shrink-0">{monthData.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Costliest Vehicles */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-6">Top Costliest Vehicles</h2>
            <div className="space-y-6">
              {sortedVehicles.map((vehicle, index) => {
                const pct = Math.max((vehicle.totalCost / maxVehicleCost) * 100, 5);
                const color = colors[index % colors.length];
                
                return (
                  <div key={vehicle.regNumber} className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 w-20 truncate">{vehicle.regNumber}</span>
                    <div className="flex-1 bg-[#1e1e1e] h-4 rounded-sm flex items-center relative overflow-hidden">
                      <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
                      {/* Dark trailing bar matching the image style */}
                      <div className="h-full bg-gray-800 flex-1 opacity-50"></div>
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right">{currencySymbol}{vehicle.totalCost.toLocaleString()}</span>
                  </div>
                );
              })}
              
              {sortedVehicles.length === 0 && (
                <div className="text-sm text-gray-500 py-4">No cost data available.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
