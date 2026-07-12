"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { createDriverSchema, updateDriverStatusSchema, CreateDriverInput } from "@/validations/driver.schema";
import { revalidatePath } from "next/cache";

export async function getDrivers(searchQuery?: string) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER"]);
  
  return prisma.driver.findMany({
    where: searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { licenseNumber: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      trips: {
        where: { status: "COMPLETED" },
        select: { id: true }
      }
    }
  });
}

export async function getDriverById(id: string) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER"]);
  
  return prisma.driver.findUnique({
    where: { id },
    include: {
      trips: {
        orderBy: { createdAt: "desc" },
        include: {
          vehicle: { select: { regNumber: true } }
        }
      }
    }
  });
}

export async function createDriver(data: CreateDriverInput) {
  await requireRole(["FLEET_MANAGER", "DISPATCHER"]);
  
  const parsed = createDriverSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }
  
  try {
    const existing = await prisma.driver.findUnique({
      where: { licenseNumber: parsed.data.licenseNumber }
    });
    if (existing) {
      return { error: "Driver with this license number already exists." };
    }
    
    await prisma.driver.create({
      data: parsed.data
    });
    
    revalidatePath("/drivers");
    return { success: true };
  } catch (error: unknown) {
    return { error: "Failed to create driver." };
  }
}

export async function updateDriverStatus(driverId: string, status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED") {
  await requireRole(["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER"]);
  
  const parsed = updateDriverStatusSchema.safeParse({ id: driverId, status });
  if (!parsed.success) {
    return { error: "Invalid status update" };
  }
  
  try {
    await prisma.driver.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status }
    });
    
    revalidatePath("/drivers");
    return { success: true };
  } catch (error: unknown) {
    return { error: "Failed to update driver status." };
  }
}
