import { z } from "zod";

export const createVehicleSchema = z.object({
  regNumber: z.string().min(1, "Registration number is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  maxLoadKg: z.coerce.number().positive("Capacity must be positive"),
  acquisitionCost: z.coerce.number().positive("Acquisition cost must be positive"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
