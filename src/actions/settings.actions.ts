"use server";

import prisma from "@/lib/prisma";
import { getSessionOrRedirect, requireRole } from "@/lib/rbac";
import { updateSettingsSchema, type UpdateSettingsInput } from "@/validations/settings.schema";
import { revalidatePath } from "next/cache";

/**
 * Read-only: returns depot settings for branding, currency, etc.
 * Accessible to any authenticated user (called from layout).
 */
export async function getDepotSettings() {
  await getSessionOrRedirect();
  
  // Upsert the singleton "default" row so it's auto-created if it doesn't exist
  return await prisma.depotSettings.upsert({
    where: { id: "default" },
    update: {}, // no-op if it exists
    create: {
      id: "default",
      depotName: "My Depot",
      currency: "INR (Rs)",
      distanceUnit: "Kilometers",
    },
  });
}

export async function updateDepotSettings(data: UpdateSettingsInput) {
  await requireRole(["FLEET_MANAGER"]);

  const parsed = updateSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const settings = await prisma.depotSettings.upsert({
      where: { id: "default" },
      update: {
        depotName: parsed.data.depotName,
        currency: parsed.data.currency,
        distanceUnit: parsed.data.distanceUnit,
      },
      create: {
        id: "default",
        depotName: parsed.data.depotName,
        currency: parsed.data.currency,
        distanceUnit: parsed.data.distanceUnit,
      },
    });

    revalidatePath("/settings");
    return { success: true, settings };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update depot settings." };
  }
}
