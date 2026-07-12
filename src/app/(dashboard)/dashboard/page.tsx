import React from "react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ROLE_LABELS } from "@/lib/rbac-client";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import type { Prisma, VehicleStatus } from "@/generated/prisma/client";

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
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

  const typeFilter = searchParams.type;
  const statusFilter = searchParams.status;
  
  const vehicleWhere: Prisma.VehicleWhereInput = {};
  if (typeFilter && typeFilter !== "All") {
    vehicleWhere.type = typeFilter;
  }
  if (statusFilter && statusFilter !== "All") {
    vehicleWhere.status = statusFilter as VehicleStatus;
  }
  
  const tripWhere: Prisma.TripWhereInput = {};
  if (Object.keys(vehicleWhere).length > 0) {
    tripWhere.vehicle = vehicleWhere;
  }

  const [
    totalVehicles,
    availableVehicles,
    maintenanceVehicles,
    activeTripsCount,
    pendingTripsCount,
    driversOnDutyCount,
    recentTrips,
    vehiclesByStatus
  ] = await Promise.all([
    prisma.vehicle.count({ where: { ...vehicleWhere, status: vehicleWhere.status || { not: "RETIRED" } } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "IN_SHOP" } }),
    prisma.trip.count({ where: { ...tripWhere, status: "DISPATCHED" } }),
    prisma.trip.count({ where: { ...tripWhere, status: "DRAFT" } }),
    prisma.driver.count({ where: { status: "ON_TRIP" } }),
    prisma.trip.findMany({
      take: 5,
      where: tripWhere,
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: true,
        driver: true,
      },
    }),
    prisma.vehicle.groupBy({
      by: ["status"],
      where: vehicleWhere,
      _count: {
        id: true,
      },
    }),
  ]);

  const fleetUtilization = totalVehicles > 0 ? Math.round((activeTripsCount / totalVehicles) * 100) : 0;

  let availableCount = 0;
  let onTripCount = 0;
  let inShopCount = 0;
  let retiredCount = 0;

  vehiclesByStatus.forEach((v) => {
    if (v.status === "AVAILABLE") availableCount = v._count.id;
    if (v.status === "ON_TRIP") onTripCount = v._count.id;
    if (v.status === "IN_SHOP") inShopCount = v._count.id;
    if (v.status === "RETIRED") retiredCount = v._count.id;
  });

  const totalStatusCount = availableCount + onTripCount + inShopCount + retiredCount;
  const getPct = (count: number) => (totalStatusCount > 0 ? (count / totalStatusCount) * 100 : 0);

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case "DISPATCHED":
        return "bg-[#3b82f6] text-white";
      case "COMPLETED":
        return "bg-[#22c55e] text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      case "DRAFT":
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getTripStatusLabel = (status: string) => {
    switch (status) {
      case "DISPATCHED":
        return "Dispatched";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      case "DRAFT":
      default:
        return "Draft";
    }
  };

  return (
    <div className="p-6 max-w-full">
      {/* Top Bar matching the image */}
      <div className="flex justify-end items-center mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{userName}</span>
          <span className="px-3 py-1 bg-[#1e293b] text-blue-400 border border-blue-900/50 rounded-full text-xs font-medium flex items-center gap-2">
            {roleDisplay} <span className="bg-blue-500/20 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">{initials}</span>
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-wide mb-6">Dashboard</h1>
        
        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-[10px] uppercase text-gray-500 tracking-widest mb-2 font-semibold">Filters</h3>
          <DashboardFilters />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          
          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Active Vehicles</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {totalVehicles.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Available Vehicles</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {availableVehicles.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Vehicles In Maintenance</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {maintenanceVehicles.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Active Trips</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {activeTripsCount.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Pending Trips</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {pendingTripsCount.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Drivers On Duty</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {driversOnDutyCount.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <h3 className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold pl-2">Fleet Utilization</h3>
            <p className="text-2xl text-white font-medium pl-2 mt-2">
              {fleetUtilization}%
            </p>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Recent Trips Table */}
          <div className="lg:col-span-2">
            <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-4">Recent Trips</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase text-gray-600">
                    <th className="pb-3 font-medium">Trip</th>
                    <th className="pb-3 font-medium">Vehicle</th>
                    <th className="pb-3 font-medium">Driver</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recentTrips.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No recent trips found
                      </td>
                    </tr>
                  ) : (
                    recentTrips.map((trip) => (
                      <tr key={trip.id} className="text-gray-300">
                        <td className="py-4 font-medium text-gray-400">TR{trip.id.substring(trip.id.length - 4).toUpperCase()}</td>
                        <td className="py-4 text-gray-300">{trip.vehicle?.regNumber || "--"}</td>
                        <td className="py-4 text-gray-300">{trip.driver?.name || "--"}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${getTripStatusColor(trip.status)}`}>
                            {getTripStatusLabel(trip.status)}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{trip.actualDistance ? `${trip.actualDistance} km` : `${trip.plannedDistance} km (est)`}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle Status */}
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-4">Vehicle Status</h2>
            <div className="space-y-6">
              
              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>Available ({availableCount})</span>
                </div>
                <div className="w-full bg-[#1e1e1e] rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${getPct(availableCount)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>On Trip ({onTripCount})</span>
                </div>
                <div className="w-full bg-[#1e1e1e] rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${getPct(onTripCount)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>In Shop ({inShopCount})</span>
                </div>
                <div className="w-full bg-[#1e1e1e] rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${getPct(inShopCount)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>Retired ({retiredCount})</span>
                </div>
                <div className="w-full bg-[#1e1e1e] rounded-full h-2.5">
                  <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${getPct(retiredCount)}%` }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

