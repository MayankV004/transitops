"use client";

import { authClient } from "@/lib/auth-client";
import type { Role } from "@/generated/prisma/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
};

/**
 * useAuth — provides the current user session state on the client.
 *
 * Usage:
 *   const { user, role, isAuthenticated, isPending } = useAuth();
 */
export function useAuth() {
  const { data: session, isPending, error } = authClient.useSession();

  const user = session?.user as AuthUser | undefined;

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!session?.user,
    isPending,
    error,
    session,
  };
}
