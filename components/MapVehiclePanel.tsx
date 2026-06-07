"use client";

import { X, Phone, Navigation, MapPin, Gauge, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearSelection } from "@/store/slices/fleetSlice";
import { carImageFor } from "@/lib/carImages";
import StatusBadge from "./StatusBadge";

export default function MapVehiclePanel() {
  const dispatch = useAppDispatch();
  const vehicle = useAppSelector((s) =>
    s.fleet.vehicles.find((v) => v.id === s.fleet.selectedVehicleId)
  );

  if (!vehicle) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-ev-border bg-ev-card shadow-card">
      <div className="relative h-[110px] bg-gradient-to-br from-ev-heading to-ev-primary">
        <img
          src={carImageFor(vehicle.id)}
          alt={vehicle.model}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ev-heading/80 via-ev-heading/20 to-transparent" />
        <button
          onClick={() => dispatch(clearSelection())}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
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
          <div className="text-[12px]">
            <div className="text-ev-mutedText">Driver</div>
            <div className="font-medium text-ev-text">{vehicle.driver}</div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-[12px]">
          <Stat label="Battery" value={`${vehicle.battery}%`} warn={vehicle.battery < 25} />
          <Stat label="Range" value={`${vehicle.range} km`} />
          <Stat
            icon={<Clock className="h-3 w-3" />}
            label="ETA to station"
            value={vehicle.etaToStationMin ? `${vehicle.etaToStationMin} min` : "—"}
          />
          <Stat
            icon={<Gauge className="h-3 w-3" />}
            label="Current speed"
            value={vehicle.currentSpeedKmh ? `${vehicle.currentSpeedKmh} km/h` : "—"}
          />
          <Stat
            icon={<MapPin className="h-3 w-3" />}
            label="Location"
            value={vehicle.location}
            colSpan
          />
        </dl>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ev-border bg-white/40 py-2 text-[12px] font-medium text-ev-heading hover:bg-white">
            <Phone className="h-3 w-3" />
            Contact Driver
          </button>
          <button className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ev-heading py-2 text-[12px] font-medium text-white hover:bg-ev-primary">
            <Navigation className="h-3 w-3" />
            Track Route
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  warn,
  colSpan,
}: {
  icon?: React.ReactNode;
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
