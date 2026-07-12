"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDepotSettings } from "@/actions/settings.actions";
import { CURRENCY_OPTIONS, DISTANCE_UNIT_OPTIONS, type UpdateSettingsInput } from "@/validations/settings.schema";
import type { DepotSettings } from "@/generated/prisma/client";

type SettingsPageProps = {
  initialSettings: DepotSettings;
};

// Based on the provided UI design spec
const RBAC_MATRIX = [
  { role: "Fleet Manager", fleet: "✓", drivers: "✓", trips: "–", fuel: "–", analytics: "✓" },
  { role: "Dispatcher", fleet: "view", drivers: "–", trips: "✓", fuel: "–", analytics: "–" },
  { role: "Safety Officer", fleet: "–", drivers: "✓", trips: "view", fuel: "–", analytics: "–" },
  { role: "Financial Analyst", fleet: "view", drivers: "–", trips: "–", fuel: "✓", analytics: "✓" },
];

export default function SettingsPage({ initialSettings }: SettingsPageProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<UpdateSettingsInput>({
    depotName: initialSettings.depotName,
    currency: initialSettings.currency,
    distanceUnit: initialSettings.distanceUnit,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateDepotSettings(formData);
      if (!result.success) {
        setError(result.error || "Failed to update settings");
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000); // clear success msg after 3s
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMatrixCell = (value: string) => {
    if (value === "✓") {
      return <span>✓</span>;
    }
    if (value === "view") {
      return <span>view</span>;
    }
    return <span className="opacity-50">{value}</span>;
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings & RBAC</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Left Column: General Settings Form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-text-muted tracking-widest uppercase mb-4">General</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label htmlFor="depotName" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  Depot Name
                </label>
                <input
                  type="text"
                  id="depotName"
                  required
                  value={formData.depotName}
                  onChange={(e) => setFormData({ ...formData, depotName: e.target.value })}
                  className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="currency" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  Currency
                </label>
                <select
                  id="currency"
                  required
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="distanceUnit" className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                  Distance Unit
                </label>
                <select
                  id="distanceUnit"
                  required
                  value={formData.distanceUnit}
                  onChange={(e) => setFormData({ ...formData, distanceUnit: e.target.value })}
                  className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                >
                  {DISTANCE_UNIT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}
              {success && <div className="text-emerald-400 text-sm">Settings saved successfully.</div>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: RBAC Matrix */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-text-muted tracking-widest uppercase mb-4">Role-Based Access (RBAC)</h2>
            <div className="table-container">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-[10px] uppercase text-text-muted tracking-wider">
                    <th className="py-3 px-4 font-medium w-[25%]">Role</th>
                    <th className="py-3 px-4 font-medium text-center">Fleet</th>
                    <th className="py-3 px-4 font-medium text-center">Drivers</th>
                    <th className="py-3 px-4 font-medium text-center">Trips</th>
                    <th className="py-3 px-4 font-medium text-center">Fuel/Exp.</th>
                    <th className="py-3 px-4 font-medium text-center">Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {RBAC_MATRIX.map((row) => (
                    <tr key={row.role} className="hover:bg-surface-hover transition-colors">
                      <td className="py-3 px-4 font-medium text-sm text-white">{row.role}</td>
                      <td className="py-3 px-4 text-sm text-white text-center">{renderMatrixCell(row.fleet)}</td>
                      <td className="py-3 px-4 text-sm text-white text-center">{renderMatrixCell(row.drivers)}</td>
                      <td className="py-3 px-4 text-sm text-white text-center">{renderMatrixCell(row.trips)}</td>
                      <td className="py-3 px-4 text-sm text-white text-center">{renderMatrixCell(row.fuel)}</td>
                      <td className="py-3 px-4 text-sm text-white text-center">{renderMatrixCell(row.analytics)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
