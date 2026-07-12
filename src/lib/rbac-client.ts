import type { Role } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Role Permission Map
// Each role lists the resources it can access.
// Resources match the nav/route identifiers used across the app.
// ---------------------------------------------------------------------------
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  FLEET_MANAGER: [
    "dashboard",
    "vehicles",
    "drivers",
    "trips",
    "maintenance",
    "fuel-expenses",
    "reports",
  ],
  DISPATCHER: [
    "dashboard",
    "vehicles",
    "drivers",
    "trips",
  ],
  SAFETY_OFFICER: [
    "dashboard",
    "drivers",
    "maintenance",
    "vehicles",
  ],
  FINANCIAL_ANALYST: [
    "dashboard",
    "fuel-expenses",
    "reports",
  ],
};

// ---------------------------------------------------------------------------
// canAccess — pure, no side-effects. Use in UI to conditionally render nav.
// ---------------------------------------------------------------------------
export function canAccess(role: Role | string | undefined, resource: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role as Role];
  if (!permissions) return false;
  return permissions.includes(resource);
}

// ---------------------------------------------------------------------------
// Role display helpers
// ---------------------------------------------------------------------------
export const ROLE_LABELS: Record<Role, string> = {
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export const ROLE_COLORS: Record<Role, string> = {
  FLEET_MANAGER: "#6366f1",   // indigo
  DISPATCHER: "#0ea5e9",      // sky
  SAFETY_OFFICER: "#f59e0b",  // amber
  FINANCIAL_ANALYST: "#10b981", // emerald
};
