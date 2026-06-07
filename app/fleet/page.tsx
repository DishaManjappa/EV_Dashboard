"use client";

import FleetToolbar from "@/components/FleetToolbar";
import FleetTable from "@/components/FleetTable";
import VehicleDetailPanel from "@/components/VehicleDetailPanel";
import { useAppSelector } from "@/store";
import { useHydrated } from "@/lib/useHydrated";

export default function FleetPage() {
  const selectedId = useAppSelector((s) => s.fleet.selectedVehicleId);
  const hydrated = useHydrated();
  // default selection ("EV-104") matches the server render; once mounted the
  // panel follows the live selection, and closing it collapses the column so
  // the table reclaims the full width.
  const showPanel = hydrated ? selectedId !== null : true;

  return (
    <div className="space-y-4">
      <FleetToolbar />
      <div
        className={`grid grid-cols-1 gap-4 ${
          showPanel ? "lg:grid-cols-[1fr_360px]" : ""
        }`}
      >
        <FleetTable />
        {showPanel && (
          <aside className="lg:sticky lg:top-[80px] lg:self-start">
            <VehicleDetailPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
