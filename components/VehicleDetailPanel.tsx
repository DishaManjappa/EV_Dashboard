"use client";

import Link from "next/link";
import { X, Zap, Phone, MapPin, Thermometer, Wrench } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearSelection } from "@/store/slices/fleetSlice";
import { vehicles as seedVehicles } from "@/lib/data";
import { carImageFor } from "@/lib/carImages";
import { useHydrated } from "@/lib/useHydrated";
import StatusBadge from "./StatusBadge";

export default function VehicleDetailPanel() {
  const dispatch = useAppDispatch();
  const hydrated = useHydrated();
  const selectedId = useAppSelector((s) => s.fleet.selectedVehicleId);
  const liveVehicle = useAppSelector((s) =>
    s.fleet.vehicles.find((v) => v.id === s.fleet.selectedVehicleId)
  );

  // seed telemetry on first paint to match the server, then go live post-mount
  const vehicle = hydrated
    ? liveVehicle
    : seedVehicles.find((v) => v.id === selectedId);

  if (!vehicle) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ev-border bg-ev-card/40 p-8 text-center text-[12.5px] text-ev-mutedText">
        Select a vehicle to inspect diagnostics.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ev-border bg-ev-card shadow-card">
      {/* Header with car photo */}
      <div className="relative h-[120px] bg-gradient-to-br from-ev-heading via-ev-active to-ev-primary">
        <img
          src={carImageFor(vehicle.id)}
          alt={vehicle.model}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ev-heading/80 via-ev-heading/20 to-transparent" />
        <button
          onClick={() => dispatch(clearSelection())}
          aria-label="Close vehicle details"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="absolute left-5 top-4 text-white">
          <div className="text-[10px] uppercase tracking-wider text-white/60">
            Selected Vehicle
          </div>
          <div className="font-display text-[22px] font-semibold leading-none">
            {vehicle.id}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display text-[15px] font-semibold text-ev-heading">
              {vehicle.model}
            </div>
            <div className="mt-0.5 text-[12px] text-ev-mutedText">
              Driver: <span className="text-ev-text">{vehicle.driver}</span>
            </div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        {/* Battery */}
        <div className="mt-4 rounded-xl border border-ev-border/70 bg-white/40 p-3">
          <div className="flex items-center justify-between text-[11px] text-ev-mutedText">
            <span>Battery</span>
            <span>{vehicle.range} km range</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-display text-[26px] font-semibold ${
                vehicle.battery < 25
                  ? "text-ev-red"
                  : vehicle.battery < 50
                    ? "text-ev-yellow"
                    : "text-ev-heading"
              }`}
            >
              {vehicle.battery}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-ev-border/60">
            <div
              className={`h-full rounded-full ${
                vehicle.battery < 25
                  ? "bg-ev-red"
                  : vehicle.battery < 50
                    ? "bg-ev-yellow"
                    : "bg-ev-primary"
              }`}
              style={{ width: `${vehicle.battery}%` }}
            />
          </div>
        </div>

        {/* Diagnostics grid */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
          <DiagItem
            icon={<Thermometer className="h-3 w-3" />}
            label="Battery Temp"
            value={`${vehicle.batteryTempC ?? "—"}°C`}
            warn={(vehicle.batteryTempC ?? 0) > 40}
          />
          <DiagItem
            icon={<Thermometer className="h-3 w-3" />}
            label="Motor Temp"
            value={`${vehicle.motorTempC ?? "—"}°C`}
            warn={(vehicle.motorTempC ?? 0) > 65}
          />
          <DiagItem
            icon={<Zap className="h-3 w-3" />}
            label="Charging Speed"
            value={`${vehicle.chargingSpeedKw ?? 0} kW`}
          />
          <DiagItem
            icon={<Wrench className="h-3 w-3" />}
            label="Last Service"
            value={vehicle.lastServiceDate ?? "—"}
          />
          <DiagItem
            icon={<MapPin className="h-3 w-3" />}
            label="Location"
            value={vehicle.location}
            colSpan
          />
        </dl>

        {/* Service history */}
        {vehicle.serviceHistory && vehicle.serviceHistory.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10.5px] uppercase tracking-wider text-ev-mutedText">
              Recent Service History
            </div>
            <ul className="space-y-1.5">
              {vehicle.serviceHistory.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-ev-border/50 bg-white/30 px-3 py-1.5 text-[12px]"
                >
                  <span className="text-ev-text">{s.label}</span>
                  <span className="text-ev-mutedText">{s.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 space-y-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-ev-heading py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ev-primary">
            <Zap className="h-3.5 w-3.5" />
            Send to Charge
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-ev-border bg-white/40 py-2 text-[12px] font-medium text-ev-heading transition-colors hover:bg-white">
              <Phone className="h-3 w-3" />
              Contact Driver
            </button>
            <Link
              href="/charging"
              className="flex items-center justify-center gap-1.5 rounded-full border border-ev-border bg-white/40 py-2 text-[12px] font-medium text-ev-heading transition-colors hover:bg-white"
            >
              <MapPin className="h-3 w-3" />
              View on Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagItem({
  icon,
  label,
  value,
  warn,
  colSpan,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  warn?: boolean;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <dt className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-ev-mutedText">
        {icon}
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-[13px] font-medium ${
          warn ? "text-ev-red" : "text-ev-text"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
