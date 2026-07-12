"use server";

import prisma from "@/lib/prisma";
import { getSessionOrRedirect } from "@/lib/rbac";

const REVENUE_PER_UNIT_DISTANCE = 3.5;

export type VehicleStat = {
  regNumber: string;
  totalCost: number;
  vDistance: number;
  vFuelLiters: number;
  vFuelCost: number;
  vMaintenanceCost: number;
  vExpenses: number;
  acquisitionCost: number;
};

export type MonthData = {
  month: string;
  revenue: number;
  year: number;
  monthNum: number;
};

export type ReportsData = {
  vehicleStats: VehicleStat[];
  totalDistance: number;
  totalFuelLiters: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalAcquisitionCost: number;
  totalExpenses: number;
  totalVehicles: number;
  activeVehicles: number;
  fuelEfficiency: string;
  fleetUtilization: number;
  operationalCost: number;
  vehicleROI: string;
  monthsData: MonthData[];
  maxRevenue: number;
  sortedVehicles: VehicleStat[];
  maxVehicleCost: number;
};

export async function getReportsData(): Promise<ReportsData> {
  await getSessionOrRedirect();

  const [vehicles, totalVehicles, activeVehicles, allCompletedTrips] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: { not: "RETIRED" } },
      include: {
        fuelLogs: true,
        maintenance: true,
        expenses: true,
        trips: { where: { status: "COMPLETED" } },
      },
    }),
    prisma.vehicle.count({ where: { status: { not: "RETIRED" } } }),
    prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
    prisma.trip.findMany({
      where: { status: "COMPLETED" },
      select: { completedAt: true, createdAt: true, actualDistance: true, plannedDistance: true },
    }),
  ]);

  const vehicleStats: VehicleStat[] = vehicles.map((v) => {
    const vDistance = v.trips.reduce((acc, t) => acc + (t.actualDistance || t.plannedDistance || 0), 0);
    const vFuelLiters = v.fuelLogs.reduce((acc, f) => acc + f.liters, 0);
    const vFuelCost = v.fuelLogs.reduce((acc, f) => acc + f.cost, 0);
    const vMaintenanceCost = v.maintenance.reduce((acc, m) => acc + m.cost, 0);
    const vExpenses = v.expenses.reduce((acc, e) => acc + e.amount, 0);

    return {
      regNumber: v.regNumber,
      totalCost: vFuelCost + vMaintenanceCost + vExpenses,
      vDistance,
      vFuelLiters,
      vFuelCost,
      vMaintenanceCost,
      vExpenses,
      acquisitionCost: v.acquisitionCost,
    };
  });

  const totalDistance = vehicleStats.reduce((acc, v) => acc + v.vDistance, 0);
  const totalFuelLiters = vehicleStats.reduce((acc, v) => acc + v.vFuelLiters, 0);
  const totalFuelCost = vehicleStats.reduce((acc, v) => acc + v.vFuelCost, 0);
  const totalMaintenanceCost = vehicleStats.reduce((acc, v) => acc + v.vMaintenanceCost, 0);
  const totalAcquisitionCost = vehicleStats.reduce((acc, v) => acc + v.acquisitionCost, 0);
  const totalExpenses = vehicleStats.reduce((acc, v) => acc + v.vExpenses, 0);

  const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(1) : "0.0";
  const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
  const operationalCost = totalFuelCost + totalMaintenanceCost + totalExpenses;

  const totalRevenue = totalDistance * REVENUE_PER_UNIT_DISTANCE;
  const vehicleROI = totalAcquisitionCost > 0
    ? (((totalRevenue - operationalCost) / totalAcquisitionCost) * 100).toFixed(1)
    : "0.0";

  // Monthly revenue for last 6 months
  const now = new Date();
  const monthsData: MonthData[] = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      revenue: 0,
      year: d.getFullYear(),
      monthNum: d.getMonth(),
    };
  });

  allCompletedTrips.forEach((trip) => {
    const date = trip.completedAt || trip.createdAt;
    const distance = trip.actualDistance || trip.plannedDistance || 0;
    const revenue = distance * REVENUE_PER_UNIT_DISTANCE;

    const monthData = monthsData.find((m) => m.monthNum === date.getMonth() && m.year === date.getFullYear());
    if (monthData) {
      monthData.revenue += revenue;
    }
  });

  const maxRevenue = Math.max(...monthsData.map((m) => m.revenue), 1000);

  // Top costliest vehicles
  const sortedVehicles = [...vehicleStats].sort((a, b) => b.totalCost - a.totalCost).slice(0, 3);
  const maxVehicleCost = sortedVehicles.length > 0 ? Math.max(sortedVehicles[0].totalCost, 1) : 1;

  return {
    vehicleStats,
    totalDistance,
    totalFuelLiters,
    totalFuelCost,
    totalMaintenanceCost,
    totalAcquisitionCost,
    totalExpenses,
    totalVehicles,
    activeVehicles,
    fuelEfficiency,
    fleetUtilization,
    operationalCost,
    vehicleROI,
    monthsData,
    maxRevenue,
    sortedVehicles,
    maxVehicleCost,
  };
}
