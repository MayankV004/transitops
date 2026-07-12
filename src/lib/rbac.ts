import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Memoize the session fetch for the duration of the request
export const getCachedSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

// The constants and canAccess have been moved to rbac-client.ts to avoid bundling server code in client components.

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
  const session = await getCachedSession();

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
  const session = await getCachedSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

// Role labels and colors moved to rbac-client.ts
