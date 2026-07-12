"use client";

import { useState, useTransition } from "react";
import { createDriver } from "@/actions/driver.actions";
import { VehicleCategory } from "@/validations/driver.schema";

export default function AddDriverModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      licenseCategory: formData.get("licenseCategory") as string,
      licenseExpiry: new Date(formData.get("licenseExpiry") as string),
      contact: formData.get("contact") as string,
    };

    startTransition(async () => {
      const result = await createDriver(data);
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Add Driver
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-surface-border p-8 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Add New Driver</h2>

            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Driver Name</label>
                <input required name="name" type="text" className="w-full bg-background border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary" placeholder="e.g. Alex" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">License No.</label>
                  <input required name="licenseNumber" type="text" className="w-full bg-background border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary" placeholder="e.g. DL-88213" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Category</label>
                  <select required name="licenseCategory" className="w-full bg-background border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary">
                    {Object.values(VehicleCategory.enum).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">License Expiry</label>
                  <input required name="licenseExpiry" type="date" className="w-full bg-background border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Contact No.</label>
                  <input required name="contact" type="text" className="w-full bg-background border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary" placeholder="98765xxxxx" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-transparent hover:bg-surface-hover text-text-subtle text-sm font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
