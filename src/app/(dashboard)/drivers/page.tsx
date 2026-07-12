import { getDrivers } from "@/actions/driver.actions";
import DriverTable from "@/components/drivers/DriverTable";
import AddDriverModal from "@/components/drivers/AddDriverModal";
import { getSessionOrRedirect } from "@/lib/rbac";
import { ROLE_LABELS, canAccess } from "@/lib/rbac-client";
import type { Role } from "@/generated/prisma/client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSessionOrRedirect();
  const user = session.user as { role?: string, name?: string };
  const role = (user.role ?? "DISPATCHER") as Role;
  
  // Resolve searchParams before accessing properties per Next.js 15+ (App Router)
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  
  const drivers = await getDrivers(query);

  return (
    <div className="p-6 lg:p-8 mx-auto flex flex-col gap-10">
      {/* Top Bar matching Wireframe style (Search + Profile) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-surface-border">
        <form className="w-full md:w-96">
          <div className="relative group">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-brand-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              name="q" 
              defaultValue={query} 
              type="text" 
              placeholder="Search drivers by name, license..." 
              className="w-full bg-surface border border-surface-border text-sm text-foreground rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-primary transition-all shadow-sm focus:shadow-brand-primary/10"
            />
          </div>
        </form>
        
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Drivers & Safety Profiles</h1>
          <p className="text-text-muted text-sm mt-1.5">Manage your fleet personnel, view licenses, and track safety scores.</p>
        </div>
        {(role === "FLEET_MANAGER" || role === "DISPATCHER") && (
          <div className="shrink-0">
            <AddDriverModal />
          </div>
        )}
      </div>

      <DriverTable drivers={drivers} />
    </div>
  );
}
