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
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Bar matching Wireframe style (Search + Profile) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-800">
        <form className="w-full md:w-96">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              name="q" 
              defaultValue={query} 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-200 rounded-md pl-9 pr-4 py-2 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </form>
        
        <div className="flex items-center gap-4 hidden md:flex">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-200">{user.name || "User"}</div>
            <div className="text-xs text-gray-500">{ROLE_LABELS[role]}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 font-bold">
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white tracking-tight">3. Drivers & Safety Profiles</h1>
        {(role === "FLEET_MANAGER" || role === "DISPATCHER") && (
          <AddDriverModal />
        )}
      </div>

      <DriverTable drivers={drivers} />
    </div>
  );
}
