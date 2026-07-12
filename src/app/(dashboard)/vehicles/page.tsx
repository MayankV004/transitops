import { getVehicles } from "@/actions/vehicle.actions";
import { getSessionOrRedirect } from "@/lib/rbac";
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import type { Role } from "@/generated/prisma/client";

export default async function VehiclesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getSessionOrRedirect();
  const user = session.user as { id: string; name: string; email: string; role?: string };
  const role = (user.role ?? "DISPATCHER") as Role;
  const isManager = role === "FLEET_MANAGER";

  const searchParams = await props.searchParams;
  const vehicles = await getVehicles(role, searchParams);

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fleet Registry</h1>
          <p className="text-text-muted text-sm mt-1.5">Manage your vehicles, track odometer readings, and view acquisition costs.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <VehicleFilters />
          {isManager && <AddVehicleModal />}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>REG. NO. (UNIQUE)</th>
              <th>NAME/MODE</th>
              <th>TYPE</th>
              <th>CAPACITY</th>
              <th>ODOMETER</th>
              <th>ACQ. COST</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.regNumber}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.maxLoadKg.toLocaleString()} kg</td>
                <td>{vehicle.odometer.toLocaleString()}</td>
                <td>{vehicle.acquisitionCost.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${vehicle.status.toLowerCase()}`}>
                    {vehicle.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-state">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    

    </div>
  );
}
