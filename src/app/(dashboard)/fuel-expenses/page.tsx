import { getSessionOrRedirect } from "@/lib/rbac";
import { getFuelLogs, getExpenses } from "@/actions/fuel-expense.actions";
import { getMaintenanceLogs } from "@/actions/maintenance.actions";
import { getVehicles } from "@/actions/vehicle.actions";
import { getActiveTrips } from "@/actions/trip.actions";
import FuelExpenseBoard from "@/components/fuel-expenses/FuelExpenseBoard";
import { calculateOperationalCost } from "@/domain/cost-calc";
import type { Role } from "@/generated/prisma/client";

export default async function Page() {
  const session = await getSessionOrRedirect();
  const user = session.user as { role?: string; name?: string };
  const role = (user.role ?? "DISPATCHER") as Role;
  
  // Can add logs if Manager, Dispatcher, or Financial Analyst
  const canManage = ["FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST"].includes(role);

  // Fetch all required data in parallel
  const [fuelLogs, expenses, maintenanceLogs, vehicles, recentTrips] = await Promise.all([
    getFuelLogs(),
    getExpenses(),
    getMaintenanceLogs(),
    // We fetch all vehicles for the dropdown (perhaps active ones)
    // Actually, "DISPATCHER" is fine to just pass as parameter for getVehicles, 
    // it will fetch all since we don't have a specific getAllVehicles action exported.
    getVehicles(role),
    getActiveTrips()
  ]);

  const totalOperationalCost = calculateOperationalCost(fuelLogs, maintenanceLogs);

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fuel & Expenses</h1>
          <p className="text-text-muted text-sm mt-1.5">Track fuel consumption, toll fees, and vehicle maintenance costs.</p>
        </div>
      </div>

      <FuelExpenseBoard 
        fuelLogs={fuelLogs}
        expenses={expenses}
        maintenanceLogs={maintenanceLogs}
        vehicles={vehicles}
        recentTrips={recentTrips}
        canManage={canManage}
        totalOperationalCost={totalOperationalCost}
      />
    </div>
  );
}
