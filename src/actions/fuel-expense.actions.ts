"use server";

import prisma from "@/lib/prisma";
import { getSessionOrRedirect, requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function getFuelLogs() {
  await getSessionOrRedirect();
  return prisma.fuelLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getExpenses() {
  await getSessionOrRedirect();
  return prisma.expense.findMany({
    include: {
      vehicle: true,
      trip: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function logFuel(data: { vehicleId: string; liters: number; cost: number }) {
  const session = await getSessionOrRedirect();
  // Only Fleet Manager or Dispatcher (or Financial Analyst) can log fuel
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST"]);

  const { vehicleId, liters, cost } = data;

  if (liters <= 0 || cost < 0) {
    throw new Error("Invalid liters or cost");
  }

  const log = await prisma.fuelLog.create({
    data: {
      vehicleId,
      liters,
      cost,
    },
  });

  revalidatePath("/fuel-expenses");
  return log;
}

export async function addExpense(data: { vehicleId: string; tripId?: string; type: string; amount: number }) {
  const session = await getSessionOrRedirect();
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST"]);

  const { vehicleId, tripId, type, amount } = data;

  if (amount < 0) {
    throw new Error("Invalid amount");
  }

  const expense = await prisma.expense.create({
    data: {
      vehicleId,
      tripId: tripId || null,
      type,
      amount,
    },
  });

  revalidatePath("/fuel-expenses");
  return expense;
}
