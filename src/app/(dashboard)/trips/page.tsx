import { getActiveTrips } from "@/actions/trip.actions";
import LiveBoard from "@/components/trips/LiveBoard";
import { getSessionOrRedirect } from "@/lib/rbac";
import { ROLE_LABELS } from "@/lib/rbac-client";
import type { Role } from "@/generated/prisma/client";
import Link from "next/link";

export default async function TripsPage() {
  const session = await getSessionOrRedirect();
  const user = session.user as { role?: string, name?: string };
  const role = (user.role ?? "DISPATCHER") as Role;

  const trips = await getActiveTrips();

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto flex flex-col gap-8 h-full">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-surface-border shrink-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <form className="w-full md:w-96">
            <div className="relative group">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-brand-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                name="q" 
                type="text" 
                placeholder="Search active trips..." 
                className="w-full bg-surface border border-surface-border text-sm text-foreground rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-primary transition-all shadow-sm focus:shadow-brand-primary/10"
              />
            </div>
          </form>

          {(role === "FLEET_MANAGER" || role === "DISPATCHER") && (
            <Link 
              href="/trips/new"
              className="hidden md:flex px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors items-center gap-2 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Create Trip
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4 hidden md:flex">
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">{user.name || "User"}</div>
            <div className="text-xs font-medium text-text-muted">{ROLE_LABELS[role]}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface border-2 border-surface-border flex items-center justify-center text-text-muted font-bold shadow-sm">
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        </div>
      </div>

      <div className="flex-1 h-full overflow-hidden">
        <LiveBoard trips={trips} />
      </div>
    </div>
  );
}
