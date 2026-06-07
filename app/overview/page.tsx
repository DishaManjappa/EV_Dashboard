"use client";

import {
  Car,
  Activity,
  Zap,
  Battery,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import MetricCard from "@/components/MetricCard";
import BatteryDonut from "@/components/BatteryDonut";
import PowerLineChart from "@/components/PowerLineChart";
import ChargingGauge from "@/components/ChargingGauge";
import FleetMap from "@/components/FleetMap";
import ActivityTable from "@/components/ActivityTable";
import { useAppSelector } from "@/store";

export default function OverviewPage() {
  const s = useAppSelector((st) => st.fleet.summary);

  return (
    <>
      {/* Metric cards */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          label="Total EVs"
          value={s.totalEvs}
          icon={Car}
          href="/fleet"
          spark={[238, 240, 239, 243, 245, 244, 246, 248]}
          delta={{ value: "2.4% this month", direction: "up" }}
        />
        <MetricCard
          label="Active Vehicles"
          value={s.activeVehicles}
          icon={Activity}
          href="/fleet"
          spark={[176, 180, 178, 185, 182, 188, 184, 184]}
          delta={{ value: "12 vs last hour", direction: "up" }}
        />
        <MetricCard
          label="Charging Now"
          value={s.chargingNow}
          icon={Zap}
          href="/charging"
          spark={[28, 31, 30, 34, 32, 38, 36, 36]}
          delta={{ value: "4 since 1pm", direction: "up" }}
        />
        <MetricCard
          label="Average Battery"
          value={`${s.averageBattery}%`}
          icon={Battery}
          href="/fleet"
          spark={[70, 69, 71, 68, 67, 69, 68, 68]}
          delta={{ value: "1.2% vs avg", direction: "down" }}
        />
        <MetricCard
          label="Active Alerts"
          value={s.activeAlerts}
          icon={AlertTriangle}
          variant="alert"
          href="/alerts"
          spark={[8, 10, 9, 13, 11, 14, 12, 12]}
          delta={{ value: "3 critical", direction: "up" }}
        />
      </section>

      {/* Charts row */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BatteryDonut />
        <div className="lg:col-span-2">
          <PowerLineChart />
        </div>
      </section>

      {/* Map + gauge */}
      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChargingGauge />
        <div className="rounded-2xl border border-ev-border bg-ev-card shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ev-border/70 px-5 py-4">
            <div>
              <h3 className="font-display text-[15px] font-semibold text-ev-heading">
                Fleet Map Overview
              </h3>
              <p className="text-[11.5px] text-ev-mutedText">
                Live positions across the service area
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-ev-mutedText">
              <Legend color="#315A3E" label="Active" />
              <Legend color="#D6A534" label="Charging" />
              <Legend color="#B64432" label="Alert" />
              <Legend color="#A8A8A0" label="Idle" />
              <Link
                href="/charging"
                className="ml-2 inline-flex items-center gap-1 rounded-full border border-ev-border bg-white/40 px-2.5 py-1 text-[11px] font-medium text-ev-heading hover:bg-white"
              >
                <MapPin className="h-3 w-3" />
                Full map
              </Link>
            </div>
          </div>
          <div className="relative h-[280px] overflow-hidden rounded-b-2xl">
            <FleetMap height="100%" variant="preview" showRoute={false} />
          </div>
        </div>
      </section>

      {/* Activity table */}
      <section className="mt-4">
        <ActivityTable />
      </section>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
