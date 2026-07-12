import { z } from 'zod';

// We import the enum from prisma to keep it in sync, or define it manually if Prisma isn't available on the edge.
// For now, defining statically for zod validation on client/server.
export const DriverStatus = z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']);
export const VehicleCategory = z.enum(['LMV', 'HMV', '2W', 'MCWG']); // based on wireframe LMV/HMV

export const createDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  licenseNumber: z.string().min(4, "License number is required"),
  licenseCategory: z.string().min(1, "Category is required"),
  licenseExpiry: z.coerce.date().refine((date) => date > new Date(), {
    message: "License must not be expired",
  }),
  contact: z.string().min(5, "Contact number is required"),
});

export const updateDriverStatusSchema = z.object({
  id: z.string(),
  status: DriverStatus,
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverStatusInput = z.infer<typeof updateDriverStatusSchema>;
