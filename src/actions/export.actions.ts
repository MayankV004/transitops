"use server";

import prisma from "@/lib/prisma";
import { getSessionOrRedirect } from "@/lib/rbac";
import { subMonths, subYears } from "date-fns";
import type { Vehicle, Trip, Driver, FuelLog, MaintenanceLog, Expense } from "@/generated/prisma/client";

export type ExportData = {
  vehicles: Array<Vehicle & {
    trips: Array<Trip & { driver: Driver | null }>;
    fuelLogs: Array<FuelLog>;
    maintenance: Array<MaintenanceLog>;
    expenses: Array<Expense>;
  }>;
  summary: {
    totalDistance: number;
    totalFuelLiters: number;
    totalFuelCost: number;
    totalMaintenanceCost: number;
    totalExpenses: number;
    totalRevenue: number;
    totalAcquisitionCost: number;
    activeTripsCount: number;
    totalVehiclesCount: number;
  };
  timeRange: "month" | "year" | "all";
};

export async function getDetailedReportData(timeRange: "month" | "year" | "all"): Promise<ExportData> {
  await getSessionOrRedirect();

  let dateFilter: Date | undefined;
  if (timeRange === "month") {
    dateFilter = subMonths(new Date(), 1);
  } else if (timeRange === "year") {
    dateFilter = subYears(new Date(), 1);
  }

  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: {
        where: dateFilter ? {
          createdAt: { gte: dateFilter }
        } : undefined,
        include: { driver: true }
      },
      fuelLogs: {
        where: dateFilter ? {
          date: { gte: dateFilter }
        } : undefined
      },
      maintenance: {
        where: dateFilter ? {
          createdAt: { gte: dateFilter }
        } : undefined
      },
      expenses: {
        where: dateFilter ? {
          date: { gte: dateFilter }
        } : undefined
      }
    }
  });

  let totalDistance = 0;
  let totalFuelLiters = 0;
  let totalFuelCost = 0;
  let totalMaintenanceCost = 0;
  let totalExpenses = 0;
  let totalAcquisitionCost = 0;
  let activeTripsCount = 0;
  const totalVehiclesCount = vehicles.length;

  // Assuming $3.50 per km as in reports page
  const REVENUE_PER_KM = 3.5;

  vehicles.forEach((v) => {
    totalAcquisitionCost += v.acquisitionCost;
    
    v.trips.forEach(t => {
      totalDistance += t.actualDistance || t.plannedDistance || 0;
      if (t.status === "DISPATCHED") {
        activeTripsCount++;
      }
    });

    v.fuelLogs.forEach(f => {
      totalFuelLiters += f.liters;
      totalFuelCost += f.cost;
    });

    v.maintenance.forEach(m => {
      totalMaintenanceCost += m.cost;
    });

    v.expenses.forEach(e => {
      totalExpenses += e.amount;
    });
  });

  const totalRevenue = totalDistance * REVENUE_PER_KM;

  return {
    vehicles,
    summary: {
      totalDistance,
      totalFuelLiters,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenses,
      totalRevenue,
      totalAcquisitionCost,
      activeTripsCount,
      totalVehiclesCount
    },
    timeRange
  };
}
