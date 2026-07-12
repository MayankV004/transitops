import { getDriverById } from "@/actions/driver.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrRedirect } from "@/lib/rbac";

const statusColors = {
  AVAILABLE: "bg-green-500/20 text-green-500 border border-green-500",
  ON_TRIP: "bg-blue-500/20 text-blue-500 border border-blue-500",
  OFF_DUTY: "bg-gray-500/20 text-gray-400 border border-gray-500",
  SUSPENDED: "bg-orange-500/20 text-orange-500 border border-orange-500",
};

const statusLabels = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await getSessionOrRedirect();
  const { id } = await params;
  const driver = await getDriverById(id);

  if (!driver) {
    notFound();
  }

  const activeTripsCount = driver.trips.filter(t => t.status === 'DISPATCHED' || t.status === 'DRAFT').length;
  const completedTripsCount = driver.trips.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/drivers" className="text-[#888888] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white">{driver.name}</h1>
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ml-2 ${statusColors[driver.status as keyof typeof statusColors]}`}>
              {statusLabels[driver.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p className="text-[#888888] ml-8">Driver ID: {driver.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1A1A1C] border border-[#333333] rounded-xl overflow-hidden">
            <div className="border-b border-[#333333] p-5">
              <h2 className="text-lg font-medium text-white">Driver Profile</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">License Number</p>
                <p className="text-white font-medium">{driver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">License Category</p>
                <p className="text-white font-medium">{driver.licenseCategory}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">License Expiry</p>
                <p className="text-white font-medium">{new Date(driver.licenseExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">Contact</p>
                <p className="text-white font-medium">{driver.contact}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1C] border border-[#333333] rounded-xl overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777777] mb-1">Safety Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-white">{driver.safetyScore}</p>
                  <p className="text-[#888888] pb-1">/ 100</p>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full border-4 flex items-center justify-center border-[#10b981]/20">
                <span className="text-[#10b981] font-bold text-lg">
                  {driver.safetyScore >= 90 ? 'A+' : driver.safetyScore >= 80 ? 'A' : driver.safetyScore >= 70 ? 'B' : 'C'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Trip History */}
        <div className="lg:col-span-2">
          <div className="bg-[#1A1A1C] border border-[#333333] rounded-xl overflow-hidden h-full">
            <div className="border-b border-[#333333] p-5 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Trip History</h2>
              <div className="text-sm text-[#888888]">
                <span className="text-white font-medium">{completedTripsCount}</span> completed · <span className="text-white font-medium">{activeTripsCount}</span> active
              </div>
            </div>
            
            <div className="p-0">
              {driver.trips.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[#888888]">No trips recorded for this driver yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#222225] border-b border-[#333333]">
                      <tr>
                        <th className="px-5 py-3 font-semibold text-[#888888]">Route</th>
                        <th className="px-5 py-3 font-semibold text-[#888888]">Date</th>
                        <th className="px-5 py-3 font-semibold text-[#888888]">Vehicle</th>
                        <th className="px-5 py-3 font-semibold text-[#888888]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {driver.trips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-[#222225] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{trip.source}</span>
                              <span className="text-[#555555]">→</span>
                              <span className="font-medium text-white">{trip.destination}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[#CCCCCC]">
                            {new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4 text-[#CCCCCC]">
                            <Link href={`/vehicles/${trip.vehicleId}`} className="text-[#4B7399] hover:underline">
                              {trip.vehicle.regNumber}
                            </Link>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              trip.status === 'COMPLETED' ? 'bg-[#10b981]/10 text-[#10b981]' :
                              trip.status === 'DISPATCHED' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' :
                              trip.status === 'CANCELLED' ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                              'bg-[#888888]/10 text-[#888888]'
                            }`}>
                              {trip.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
