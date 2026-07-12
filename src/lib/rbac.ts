import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
// requireRole — server-side guard for Server Actions and Server Components.
// Call at the top of any action that should be restricted.
//
// Usage in a Server Action:
//   const session = await requireRole(["FLEET_MANAGER", "DISPATCHER"]);
//
// Throws a redirect to /login if there is no session.
// Throws a redirect to /dashboard if the role is not in the allowed list.
// ---------------------------------------------------------------------------
export async function requireRole(allowed: Role[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = (session.user as { role?: string }).role as Role | undefined;

  if (!userRole || !allowed.includes(userRole)) {
    // User is authenticated but lacks the required role — bounce to dashboard
    // where they'll only see what they're allowed to see.
    redirect("/dashboard");
  }

  return session;
}

// ---------------------------------------------------------------------------
// getSessionOrRedirect — use in Server Components / layouts that need
// a valid session without role restriction.
// ---------------------------------------------------------------------------
export async function getSessionOrRedirect() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return session;
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
  FLEET_MANAGER: "#b48a58",   // brownish-beige
  DISPATCHER: "#0ea5e9",      // sky
  SAFETY_OFFICER: "#f59e0b",  // amber
  FINANCIAL_ANALYST: "#10b981", // emerald
};
