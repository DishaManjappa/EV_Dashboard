// Derives the live alert feed from vehicle telemetry. Pure and deterministic
// (no Date/random), so it can both seed the store at import time and run inside
// every simulation tick. Alerts use a stable `${vehicleId}-${type}` id so an
// ongoing condition is never duplicated, and clears itself when the condition
// goes away (it simply isn't re-emitted).

import type { Vehicle, FleetAlert, AlertType } from "./types";

const SEVERITY_RANK: Record<AlertType, number> = {
  Critical: 0,
  "Low Battery": 1,
  Overheating: 2,
  "Route Delay": 3,
};

function evaluate(v: Vehicle): { type: AlertType; message: string }[] {
  const out: { type: AlertType; message: string }[] = [];
  const batt = Math.round(v.battery);

  if (v.status === "Alert")
    out.push({
      type: "Critical",
      message: `Critical battery at ${batt}% — dispatch to charging immediately`,
    });

  if (batt < 25 && v.chargingMode === "Not Charging" && v.status !== "Alert")
    out.push({
      type: "Low Battery",
      message: `Battery low at ${batt}% — plan a charging stop`,
    });

  if ((v.batteryTempC ?? 0) >= 40 || (v.motorTempC ?? 0) >= 70)
    out.push({
      type: "Overheating",
      message: `High temperature — battery ${Math.round(
        v.batteryTempC ?? 0
      )}°C, motor ${Math.round(v.motorTempC ?? 0)}°C`,
    });

  if (v.status === "En Route" && (v.currentSpeedKmh ?? 99) < 25)
    out.push({
      type: "Route Delay",
      message: `Slow progress on route — ${Math.round(
        v.currentSpeedKmh ?? 0
      )} km/h`,
    });

  return out;
}

export function deriveAlerts(
  vehicles: Vehicle[],
  prev: FleetAlert[]
): FleetAlert[] {
  const prevById = new Map(prev.map((a) => [a.id, a]));
  const next: FleetAlert[] = [];

  for (const v of vehicles) {
    for (const { type, message } of evaluate(v)) {
      const id = `${v.id}-${type}`;
      next.push({
        id,
        vehicleId: v.id,
        type,
        message,
        time: prevById.get(id)?.time ?? "Just now", // keep age for ongoing alerts
      });
    }
  }

  return next.sort((a, b) => SEVERITY_RANK[a.type] - SEVERITY_RANK[b.type]);
}
