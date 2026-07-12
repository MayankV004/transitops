import type { FuelLog, MaintenanceLog, Expense } from "@/generated/prisma/client";

/**
 * Calculates the total operational cost.
 * Per spec 3.7: TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINTENANCE
 */
export function calculateOperationalCost(
  fuelLogs: Pick<FuelLog, "cost">[],
  maintenanceLogs: Pick<MaintenanceLog, "cost" | "isActive">[]
): number {
  const fuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  
  // We can choose to include all maintenance costs or only closed ones. 
  // Let's include all of them as it's a sunk cost either way.
  const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);

  return fuelCost + maintenanceCost;
}

/**
 * Calculates the total of other expenses.
 */
export function calculateTotalExpenses(
  expenses: Pick<Expense, "amount">[]
): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}
