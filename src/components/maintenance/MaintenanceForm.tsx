"use client";

import { useState } from "react";
import { createMaintenanceLog } from "@/actions/maintenance.actions";
import { useRouter } from "next/navigation";

export default function MaintenanceForm({ vehicles }: { vehicles: { id: string; regNumber: string; name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const vehicleId = formData.get("vehicleId") as string;
    const description = formData.get("description") as string;
    const cost = parseFloat(formData.get("cost") as string);
    const date = new Date(formData.get("date") as string);

    const res = await createMaintenanceLog({ vehicleId, description, cost, date });
    if (res.success) {
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } else {
      setError("error" in res ? (res.error as string) : "Failed to log maintenance.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[#94a3b8] text-xs font-bold uppercase tracking-wider">Log Service Record</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div className="flex flex-col gap-2">
          <label className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Vehicle</label>
          <select 
            name="vehicleId" 
            required 
            className="w-full bg-[#09090b] border border-[#ffffff14] text-sm text-[#f8fafc] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#b48a58]"
            defaultValue=""
          >
            <option value="" disabled>Select Vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.regNumber})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Service Type</label>
          <input 
            type="text" 
            name="description" 
            required
            placeholder="e.g. Oil Change"
            className="w-full bg-[#09090b] border border-[#ffffff14] text-sm text-[#f8fafc] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#b48a58]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Cost</label>
          <input 
            type="number" 
            name="cost" 
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full bg-[#09090b] border border-[#ffffff14] text-sm text-[#f8fafc] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#b48a58]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Date</label>
          <input 
            type="date" 
            name="date" 
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#09090b] border border-[#ffffff14] text-sm text-[#f8fafc] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#b48a58]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Status</label>
          <input 
            type="text" 
            disabled
            value="Active"
            className="w-full bg-[#09090b] border border-[#ffffff14] text-sm text-[#94a3b8] rounded-lg px-4 py-2.5 opacity-70 cursor-not-allowed"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 bg-[#b48a58] hover:bg-[#a37947] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

     
    </div>
  );
}
