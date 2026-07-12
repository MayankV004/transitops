"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function getMaintenanceLogs() {
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER"]); // Depends on who can view

  return await prisma.maintenanceLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMaintenanceLog(data: { vehicleId: string; description: string; cost: number; date: Date }) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]); // Only managers or dispatchers might log maintenance

  try {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.create({
        data: {
          vehicleId: data.vehicleId,
          description: data.description,
          cost: data.cost,
          isActive: true,
          createdAt: data.date, // using the provided date, though typically this would just be now. We map it to createdAt or date if exists. Wait, schema has createdAt, updatedAt, closedAt.
        },
      });

      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: "IN_SHOP" },
      });

      return { success: true, log };
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create maintenance log.";
    return { success: false, error: message };
  }
}

export async function closeMaintenanceLog(id: string) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]);

  try {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.findUnique({
        where: { id },
        include: { vehicle: true },
      });

      if (!log || !log.isActive) {
        return { success: false, error: "Log not found or already closed." };
      }

      await tx.maintenanceLog.update({
        where: { id },
        data: { isActive: false, closedAt: new Date() },
      });

      // If vehicle is IN_SHOP, make it AVAILABLE. (It could be RETIRED, in which case we leave it alone per the plan)
      if (log.vehicle.status === "IN_SHOP") {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: "AVAILABLE" },
        });
      }

      return { success: true };
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to close maintenance log.";
    return { success: false, error: message };
  }
}
