"use client";

import { useState } from "react";
import { closeMaintenanceLog } from "@/actions/maintenance.actions";
import { useRouter } from "next/navigation";

export default function MaintenanceTable({ logs, canManage }: { logs: { id: string; description: string; cost: number; isActive: boolean; vehicle: { regNumber: string } }[]; canManage: boolean }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleClose(id: string) {
    if (!canManage || !confirm("Mark this service record as completed?")) return;
    
    setLoadingId(id);
    const res = await closeMaintenanceLog(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Failed to close record");
    }
    setLoadingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[#94a3b8] text-xs font-bold uppercase tracking-wider">Service Log</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>VEHICLE</th>
              <th>SERVICE</th>
              <th>COST</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.vehicle.regNumber}</td>
                <td>{log.description}</td>
                <td>{log.cost.toLocaleString()}</td>
                <td>
                  {log.isActive ? (
                    <button
                      onClick={() => handleClose(log.id)}
                      disabled={loadingId === log.id || !canManage}
                      className={`status-badge status-in_shop ${canManage ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${loadingId === log.id ? 'opacity-50' : ''}`}
                      title={canManage ? "Click to mark completed" : ""}
                    >
                      {loadingId === log.id ? "Updating..." : "In Shop"}
                    </button>
                  ) : (
                    <span className="status-badge status-available">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-state">
                  No service records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
