"use client";

import { useAuth } from "@/hooks/use-auth";
import { canAccess, ROLE_LABELS, ROLE_PERMISSIONS, type ROLE_COLORS } from "@/lib/rbac-client";
import type { Role } from "@/generated/prisma/client";

/**
 * useRole — provides role-based access helpers for client components.
 *
 * Usage:
 *   const { role, roleLabel, can, allowedRoutes } = useRole();
 *   if (can("trips")) { ... }
 */
export function useRole() {
  const { role, isAuthenticated, isPending } = useAuth();

  return {
    role: role as Role | null,
    roleLabel: role ? ROLE_LABELS[role as Role] : null,
    isAuthenticated,
    isPending,
    /** Check if the current user can access a given resource */
    can: (resource: string) => canAccess(role ?? undefined, resource),
    /** All resources the current role can access */
    allowedRoutes: role ? ROLE_PERMISSIONS[role as Role] : [],
  };
}
