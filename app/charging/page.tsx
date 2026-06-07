"use client";

import { Activity, Zap, AlertTriangle, BatteryCharging } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import FleetMap from "@/components/FleetMap";
import MapVehiclePanel from "@/components/MapVehiclePanel";
import StationDetailPanel from "@/components/StationDetailPanel";
import { useAppSelector } from "@/store";

export default function ChargingPage() {
  const summary = useAppSelector((s) => s.fleet.summary);
  const selectedVehicleId = useAppSelector((s) => s.fleet.selectedVehicleId);
  const selectedStationId = useAppSelector((s) => s.fleet.selectedStationId);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Vehicles Online"
          value={`${summary.vehiclesOnline} of ${summary.totalEvs}`}
          icon={Activity}
          href="/fleet"
          spark={[176, 180, 178, 185, 182, 188, 184, 184]}
          delta={{ value: "Real time", direction: "up" }}
        />
        <MetricCard
          label="Vehicles Charging"
          value={`${summary.chargingNow} of ${summary.totalEvs}`}
          icon={BatteryCharging}
          href="/fleet"
          spark={[28, 31, 30, 34, 32, 38, 36, 36]}
          delta={{ value: "4 added 1h", direction: "up" }}
        />
        <MetricCard
          label="Active Alerts"
          value={summary.activeAlerts}
          icon={AlertTriangle}
          variant="alert"
          href="/alerts"
          spark={[8, 10, 9, 13, 11, 14, 12, 12]}
          delta={{ value: "3 critical", direction: "up" }}
        />
        <MetricCard
          label="Stations In Use"
          value={`${summary.stationLoadPct}%`}
          icon={Zap}
          spark={[58, 62, 60, 67, 64, 70, 67, 67]}
          delta={{
            value: `${summary.stationsInUse} of ${summary.stationsTotal}`,
            direction: "up",
          }}
        />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-ev-border bg-ev-card shadow-card">
          <div className="flex items-center justify-between border-b border-ev-border/70 px-5 py-3">
            <div>
              <h3 className="font-display text-[15px] font-semibold text-ev-heading">
                Fleet & Charging Network
              </h3>
              <p className="text-[11.5px] text-ev-mutedText">
                Click any vehicle or station marker for details
              </p>
            </div>
            <div className="hidden flex-wrap items-center gap-3 text-[10.5px] text-ev-mutedText md:flex">
              <Legend color="#315A3E" label="Active" />
              <Legend color="#A8A8A0" label="Idle" />
              <Legend color="#D6A534" label="Charging" />
              <Legend color="#B64432" label="Alert" />
              <Legend color="#103524" label="Station" station />
            </div>
          </div>
          <div className="relative h-[560px]">
            <FleetMap height="100%" variant="full" showRoute={true} />
            {/* Bottom legend for mobile */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-center gap-3 rounded-full border border-ev-border bg-ev-card/95 px-3 py-1.5 text-[10.5px] text-ev-mutedText backdrop-blur md:hidden">
              <Legend color="#315A3E" label="Active" />
              <Legend color="#A8A8A0" label="Idle" />
              <Legend color="#D6A534" label="Charging" />
              <Legend color="#B64432" label="Alert" />
              <Legend color="#103524" label="Station" station />
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[80px] lg:self-start">
          {selectedStationId ? (
            <StationDetailPanel />
          ) : selectedVehicleId ? (
            <MapVehiclePanel />
          ) : (
            <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-ev-border bg-ev-card/40 p-8 text-center text-[12.5px] text-ev-mutedText">
              Click a vehicle or station marker on the map to view details.
            </div>
          )}
        </aside>
      </section>
    </>
  );
}

function Legend({
  color,
  label,
  station,
}: {
  color: string;
  label: string;
  station?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${station ? "h-2.5 w-2.5 rounded-sm" : "h-2 w-2 rounded-full"}`}
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
