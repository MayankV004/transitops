import { getMaintenanceLogs } from "@/actions/maintenance.actions";
import { getVehicles } from "@/actions/vehicle.actions";
import { getSessionOrRedirect } from "@/lib/rbac";
import MaintenanceForm from "@/components/maintenance/MaintenanceForm";
import MaintenanceTable from "@/components/maintenance/MaintenanceTable";
import type { Role } from "@/generated/prisma/client";

export default async function Page() {
  const session = await getSessionOrRedirect();
  const user = session.user as { role?: string; name?: string };
  const role = (user.role ?? "DISPATCHER") as Role;
  
  // Can log/close maintenance if Manager or Dispatcher (or depending on rules)
  const canManage = role === "FLEET_MANAGER" || role === "DISPATCHER";

  const logs = await getMaintenanceLogs();
  // Fetch vehicles that can be put in shop (e.g. not retired)
  // We use dispatcher role so it filters out RETIRED and IN_SHOP, meaning only AVAILABLE vehicles can go IN_SHOP
  const vehicles = await getVehicles("DISPATCHER");

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Maintenance</h1>
          <p className="text-text-muted text-sm mt-1.5">Log service records, track repair costs, and manage vehicle availability.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          {canManage ? (
            <MaintenanceForm vehicles={vehicles} />
          ) : (
            <div className="text-[#94a3b8] italic">You do not have permission to log service records.</div>
          )}
        </div>
        <div>
          <MaintenanceTable logs={logs} canManage={canManage} />
        </div>
      </div>
    </div>
  );
}
