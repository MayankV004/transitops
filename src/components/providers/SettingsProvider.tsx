"use client";

import { createContext, useContext, ReactNode } from "react";
import type { DepotSettings } from "@/generated/prisma/client";

type SettingsContextType = {
  settings: DepotSettings;
  currencySymbol: string;
  distanceUnitLabel: string;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper to extract the symbol from strings like "USD ($)", "INR (₹)"
function extractCurrencySymbol(currencyStr: string): string {
  const match = currencyStr.match(/\((.*?)\)/);
  if (match && match[1]) {
    return match[1];
  }
  // Fallback to the whole string if no parentheses
  return currencyStr;
}

// Helper for distance unit
function formatDistanceUnit(unitStr: string): string {
  if (unitStr.toLowerCase() === "kilometers") return "km";
  if (unitStr.toLowerCase() === "miles") return "mi";
  return unitStr;
}

export function SettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: DepotSettings;
}) {
  const currencySymbol = extractCurrencySymbol(settings.currency);
  const distanceUnitLabel = formatDistanceUnit(settings.distanceUnit);

  return (
    <SettingsContext.Provider value={{ settings, currencySymbol, distanceUnitLabel }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
