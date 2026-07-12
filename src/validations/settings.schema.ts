import { z } from "zod";

export const updateSettingsSchema = z.object({
  depotName: z.string().min(1, "Depot name is required").max(100),
  currency: z.string().min(1, "Currency is required"),
  distanceUnit: z.string().min(1, "Distance unit is required"),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

export const CURRENCY_OPTIONS = [
  "INR (Rs)",
  "USD ($)",
  "EUR (€)",
  "GBP (£)",
];

export const DISTANCE_UNIT_OPTIONS = [
  "Kilometers",
  "Miles",
];
