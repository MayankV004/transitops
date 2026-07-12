"use client";

import { useState } from "react";
import { logFuel } from "@/actions/fuel-expense.actions";
import type { Vehicle } from "@/generated/prisma/client";

export default function LogFuelModal({ vehicles }: { vehicles: Vehicle[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const vehicleId = formData.get("vehicleId") as string;
    const liters = parseFloat(formData.get("liters") as string);
    const cost = parseFloat(formData.get("cost") as string);

    if (!vehicleId) {
      setError("Please select a vehicle.");
      setIsSubmitting(false);
      return;
    }
    
    if (isNaN(liters) || liters <= 0 || isNaN(cost) || cost < 0) {
      setError("Please enter valid positive numbers for liters and cost.");
      setIsSubmitting(false);
      return;
    }

    try {
      await logFuel({ vehicleId, liters, cost });
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log fuel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2"
      >
        <span>+ Log Fuel</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-surface-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Log Fuel</h3>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Vehicle</label>
                <select 
                  name="vehicleId" 
                  defaultValue=""
                  className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="" disabled>Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.regNumber})</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Liters</label>
                  <input 
                    type="number" 
                    name="liters" 
                    step="0.1"
                    min="0.1"
                    placeholder="0.0"
                    className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Total Cost</label>
                  <input 
                    type="number" 
                    name="cost" 
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Fuel Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
