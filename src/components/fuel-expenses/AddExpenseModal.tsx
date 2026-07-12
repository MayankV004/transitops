"use client";

import { useState } from "react";
import { addExpense } from "@/actions/fuel-expense.actions";
import type { Vehicle, Trip } from "@/generated/prisma/client";

export default function AddExpenseModal({ 
  vehicles, 
  recentTrips 
}: { 
  vehicles: Vehicle[], 
  recentTrips: Trip[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const vehicleId = formData.get("vehicleId") as string;
    const tripId = formData.get("tripId") as string;
    const type = formData.get("type") as string;
    const amount = parseFloat(formData.get("amount") as string);

    if (!vehicleId) {
      setError("Please select a vehicle.");
      setIsSubmitting(false);
      return;
    }

    if (!type) {
      setError("Please select an expense type.");
      setIsSubmitting(false);
      return;
    }
    
    if (isNaN(amount) || amount < 0) {
      setError("Please enter a valid amount.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addExpense({ vehicleId, tripId, type, amount });
      setIsOpen(false);
      setSelectedVehicle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTrips = recentTrips.filter(t => t.vehicleId === selectedVehicle);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl border border-brand-primary text-brand-primary hover:bg-brand-primary/10 font-medium text-sm transition-colors flex items-center gap-2"
      >
        <span>+ Add Expense</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-surface-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Add Expense</h3>
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
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="" disabled>Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.regNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Trip (Optional)</label>
                <select 
                  name="tripId" 
                  defaultValue=""
                  disabled={!selectedVehicle || availableTrips.length === 0}
                  className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary disabled:opacity-50"
                >
                  <option value="">No specific trip</option>
                  {availableTrips.map((t) => (
                    <option key={t.id} value={t.id}>Trip {t.id.slice(-5).toUpperCase()} ({t.status})</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Type</label>
                  <select 
                    name="type" 
                    defaultValue="Toll"
                    className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Toll">Toll</option>
                    <option value="Parking">Parking</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted">Amount</label>
                  <input 
                    type="number" 
                    name="amount" 
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
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
