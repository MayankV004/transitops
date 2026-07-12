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
      <div className="top-bar">
        <VehicleFilters />
        {isManager && <AddVehicleModal />}
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

    

      <style>{`
        .page-container {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #09090b;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .table-container {
          flex: 1;
          background: #09090b;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          text-transform: uppercase;
        }

        .data-table td {
          padding: 1rem;
          color: #f1f5f9;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .data-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .empty-state {
          text-align: center;
          color: #94a3b8;
          padding: 3rem !important;
        }

        /* Status Badges based on reference UI */
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .status-available {
          background: #22c55e;
          color: #fff;
        }
        
        .status-on_trip {
          background: #3b82f6;
          color: #fff;
        }
        
        .status-in_shop {
          background: #f97316;
          color: #fff;
        }
        
        .status-retired {
          background: #ef4444;
          color: #fff;
        }

        .rule-text {
          font-size: 0.875rem;
          color: #f59e0b;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
