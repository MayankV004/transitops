import { getAvailableResources } from "@/actions/trip.actions";
import CreateTripForm from "@/components/trips/CreateTripForm";
import { getSessionOrRedirect } from "@/lib/rbac";
import type { Role } from "@/generated/prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewTripPage() {
  const session = await getSessionOrRedirect();
  const user = session.user as { role?: string, name?: string };
  const role = (user.role ?? "DISPATCHER") as Role;

  if (role !== "FLEET_MANAGER" && role !== "DISPATCHER") {
    redirect("/trips");
  }

  const { vehicles, drivers } = await getAvailableResources();

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto flex flex-col gap-8 h-full">
      
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-4 pb-6 border-b border-surface-border">
        <Link 
          href="/trips" 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface border border-transparent hover:border-surface-border transition-colors text-text-muted hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Create New Trip</h1>
          <p className="text-sm text-text-muted mt-1">Assign an available vehicle and driver to a new route.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Trip Lifecycle Stepper Visual */}
        <div className="bg-transparent mb-2">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-6">TRIP LIFECYCLE</h2>
          <div className="flex items-center justify-between relative px-2 max-w-lg">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-surface-border -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-status-available border-2 border-background"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-status-available">Draft</span>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-status-on-trip border-2 border-background"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-status-on-trip">Dispatched</span>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-text-muted border-2 border-background"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Completed</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-text-muted border-2 border-background"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Cancelled</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
           <CreateTripForm vehicles={vehicles} drivers={drivers} />
        </div>
      </div>

    </div>
  );
}
