"use client";

import { AlertTriangle, Battery, Thermometer, MapPin, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { resolveAlert, selectVehicle } from "@/store/slices/fleetSlice";
import { acknowledgeAlert } from "@/store/slices/uiSlice";
import StatusBadge from "@/components/StatusBadge";
import type { AlertType } from "@/lib/types";

const alertTypes: {
  label: AlertType;
  color: string;
  icon: typeof AlertTriangle;
}[] = [
  { label: "Critical", color: "border-ev-red bg-ev-lightRed/60 text-ev-red", icon: AlertTriangle },
  { label: "Low Battery", color: "border-ev-yellow/40 bg-ev-lightYellow/60 text-ev-yellow", icon: Battery },
  { label: "Overheating", color: "border-ev-yellow/40 bg-ev-lightYellow/60 text-ev-yellow", icon: Thermometer },
  { label: "Route Delay", color: "border-ev-border bg-white/40 text-ev-mutedText", icon: MapPin },
];

const ROW_ICON: Record<AlertType, typeof AlertTriangle> = {
  Critical: AlertTriangle,
  "Low Battery": Battery,
  Overheating: Thermometer,
  "Route Delay": MapPin,
};

const ROW_TONE: Record<AlertType, string> = {
  Critical: "bg-ev-lightRed/60 text-ev-red",
  "Low Battery": "bg-ev-lightYellow/70 text-ev-yellow",
  Overheating: "bg-ev-lightYellow/70 text-ev-yellow",
  "Route Delay": "bg-ev-light/60 text-ev-primary",
};

export default function AlertsPage() {
  const alerts = useAppSelector((s) => s.fleet.alerts);
  const vehicles = useAppSelector((s) => s.fleet.vehicles);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const inspect = (id: string, vehicleId: string) => {
    dispatch(acknowledgeAlert(id));
    dispatch(selectVehicle(vehicleId));
    router.push("/fleet");
  };

  return (
    <>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {alertTypes.map((a) => {
          const Icon = a.icon;
          const count = alerts.filter((x) => x.type === a.label).length;
          return (
            <div key={a.label} className={`rounded-2xl border p-5 shadow-card ${a.color}`}>
              <div className="flex items-start justify-between">
                <span className="text-[11.5px] uppercase tracking-wider opacity-80">
                  {a.label}
                </span>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-3 font-display text-[28px] font-semibold tabular-nums">
                {count}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 rounded-2xl border border-ev-border bg-ev-card shadow-card">
        <div className="border-b border-ev-border/70 px-5 py-4">
          <h3 className="font-display text-[15px] font-semibold text-ev-heading">
            Active Incidents
          </h3>
          <p className="text-[11.5px] text-ev-mutedText">
            Click a row to inspect the vehicle · Resolve to dispatch remediation
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ev-light/50 text-ev-primary">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <p className="text-[14px] font-semibold text-ev-heading">All systems nominal</p>
            <p className="mt-0.5 text-[12px] text-ev-mutedText">
              No active alerts across the fleet right now
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ev-border/50">
            {alerts.map((a) => {
              const v = vehicles.find((x) => x.id === a.vehicleId);
              const Icon = ROW_ICON[a.type];
              return (
                <li
                  key={a.id}
                  onClick={() => inspect(a.id, a.vehicleId)}
                  className="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-white/40"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ROW_TONE[a.type]}`}>
                    <Icon className="h-4 w-4" strokeWidth={2.1} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ev-heading">{a.vehicleId}</span>
                      {v && (
                        <>
                          <span className="text-[12px] text-ev-mutedText">·</span>
                          <span className="text-[12px] text-ev-text">{v.model}</span>
                        </>
                      )}
                      <span className="ml-1 rounded-full bg-ev-bg px-2 py-0.5 text-[10px] font-medium text-ev-mutedText">
                        {a.type}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[11.5px] text-ev-mutedText">
                      {a.message}
                      {v ? ` · ${v.location}` : ""} · {a.time}
                    </div>
                  </div>
                  {v && (
                    <div className="hidden w-24 md:block">
                      <div className="text-[10.5px] uppercase tracking-wider text-ev-mutedText">
                        Battery
                      </div>
                      <div
                        className={`text-[14px] font-semibold tabular-nums ${
                          v.battery < 25 ? "text-ev-red" : "text-ev-heading"
                        }`}
                      >
                        {Math.round(v.battery)}%
                      </div>
                    </div>
                  )}
                  {v && <StatusBadge status={v.status} />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(resolveAlert(a.id));
                    }}
                    className="rounded-full bg-ev-heading px-3 py-1.5 text-[11.5px] font-medium text-white transition-colors hover:bg-ev-primary"
                  >
                    Resolve
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
