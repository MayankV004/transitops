"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { createVehicleSchema, type CreateVehicleInput } from "@/validations/vehicle.schema";
import { revalidatePath } from "next/cache";

export async function createVehicle(data: CreateVehicleInput) {
  await requireRole(["FLEET_MANAGER"]);

  const parsed = createVehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const existing = await prisma.vehicle.findUnique({
      where: { regNumber: parsed.data.regNumber },
    });

    if (existing) {
      return { success: false, error: "Registration number must be unique." };
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        regNumber: parsed.data.regNumber,
        name: parsed.data.name,
        type: parsed.data.type,
        maxLoadKg: parsed.data.maxLoadKg,
        acquisitionCost: parsed.data.acquisitionCost,
      },
    });

    revalidatePath("/vehicles");
    return { success: true, vehicle };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create vehicle." };
  }
}

export async function getVehicles(role: string, searchParams?: { type?: string; status?: string; search?: string }) {
  const where: any = {};

  if (role === "DISPATCHER") {
    where.status = { notIn: ["RETIRED", "IN_SHOP"] };
  }

  if (searchParams?.type && searchParams.type !== "All") {
    where.type = searchParams.type;
  }

  if (searchParams?.status && searchParams.status !== "All") {
    // If dispatcher is searching, we must still respect the notIn exclusion
    if (role === "DISPATCHER" && ["RETIRED", "IN_SHOP"].includes(searchParams.status)) {
      return []; // Return empty if they try to explicitly filter by hidden status
    }
    where.status = searchParams.status;
  }

  if (searchParams?.search) {
    where.regNumber = { contains: searchParams.search, mode: "insensitive" };
  }

  return await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}
