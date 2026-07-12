"use server";

import prisma from "@/lib/prisma";
import { getSessionOrRedirect, requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { canDispatch, checkCapacity } from "@/domain/trip-rules";

export async function getAvailableResources() {
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST"]);
  
  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      select: { id: true, regNumber: true, maxLoadKg: true, name: true }
    }),
    prisma.driver.findMany({
      where: { 
        status: "AVAILABLE",
        licenseExpiry: { gt: new Date() } // License not expired
      },
      select: { id: true, name: true, licenseCategory: true }
    })
  ]);

  return { vehicles, drivers };
}

export async function getActiveTrips() {
  await getSessionOrRedirect();
  return prisma.trip.findMany({
    where: {
      status: { in: ["DRAFT", "DISPATCHED", "CANCELLED", "COMPLETED"] } // Return all for now to show lifecycle
    },
    include: {
      vehicle: { select: { regNumber: true, name: true } },
      driver: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}

export async function createTrip(data: {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
}) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]);
  
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) return { error: "Vehicle not found" };

  const capacityCheck = checkCapacity(vehicle, data.cargoWeight);
  if (!capacityCheck.valid) {
    return { error: capacityCheck.error };
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        source: data.source,
        destination: data.destination,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        cargoWeight: data.cargoWeight,
        plannedDistance: data.plannedDistance,
        status: "DRAFT"
      }
    });
    
    revalidatePath("/trips");
    return { success: true, trip };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function dispatchTrip(tripId: string) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]);

  // Need to use transaction to ensure atomicity
  try {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true, driver: true }
      });

      if (!trip) throw new Error("Trip not found");
      if (trip.status !== "DRAFT") throw new Error("Only DRAFT trips can be dispatched");

      const dispatchCheck = canDispatch(trip.vehicle, trip.driver, trip.cargoWeight);
      if (!dispatchCheck.valid) {
        throw new Error(dispatchCheck.error);
      }

      // Atomically update driver and vehicle (checking they are still available)
      const vUpdate = await tx.vehicle.updateMany({
        where: { id: trip.vehicleId, status: "AVAILABLE" },
        data: { status: "ON_TRIP" }
      });
      if (vUpdate.count === 0) throw new Error("Vehicle became unavailable");

      const dUpdate = await tx.driver.updateMany({
        where: { id: trip.driverId, status: "AVAILABLE" },
        data: { status: "ON_TRIP" }
      });
      if (dUpdate.count === 0) throw new Error("Driver became unavailable");

      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: "DISPATCHED" }
      });

      return { success: true, trip: updatedTrip };
    });
  } catch (error: any) {
    return { error: error.message };
  } finally {
    revalidatePath("/trips");
    revalidatePath("/vehicles");
    revalidatePath("/drivers");
  }
}

export async function completeTrip(tripId: string, finalOdometer: number, fuelConsumed: number) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]);

  try {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true }
      });
      
      if (!trip) throw new Error("Trip not found");
      if (trip.status !== "DISPATCHED") throw new Error("Only DISPATCHED trips can be completed");
      
      const distanceCovered = finalOdometer - trip.vehicle.odometer;
      if (distanceCovered < 0) throw new Error("Final odometer cannot be less than current odometer");

      // Log fuel
      if (fuelConsumed > 0) {
        await tx.fuelLog.create({
          data: {
            vehicleId: trip.vehicleId,
            liters: fuelConsumed,
            // Simple generic cost, can be enhanced later
            cost: fuelConsumed * 1.5,
          }
        });
      }

      // Update Vehicle
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { 
          status: "AVAILABLE",
          odometer: finalOdometer
        }
      });

      // Update Driver
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: "AVAILABLE" }
      });

      // Complete Trip
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { 
          status: "COMPLETED",
          actualDistance: distanceCovered,
          fuelConsumed: fuelConsumed,
          completedAt: new Date()
        }
      });

      return { success: true, trip: updatedTrip };
    });
  } catch (error: any) {
    return { error: error.message };
  } finally {
    revalidatePath("/trips");
    revalidatePath("/vehicles");
    revalidatePath("/drivers");
  }
}

export async function cancelTrip(tripId: string) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]);

  try {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        select: { status: true, vehicleId: true, driverId: true }
      });
      
      if (!trip) throw new Error("Trip not found");
      if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
        throw new Error("Cannot cancel a completed or already cancelled trip");
      }

      if (trip.status === "DISPATCHED") {
        // Free up resources
        await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "AVAILABLE" } });
        await tx.driver.update({ where: { id: trip.driverId }, data: { status: "AVAILABLE" } });
      }

      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: "CANCELLED" }
      });

      return { success: true, trip: updatedTrip };
    });
  } catch (error: any) {
    return { error: error.message };
  } finally {
    revalidatePath("/trips");
    revalidatePath("/vehicles");
    revalidatePath("/drivers");
  }
}

export async function getTripById(id: string) {
  await getSessionOrRedirect();
  return prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: true
    }
  });
}
