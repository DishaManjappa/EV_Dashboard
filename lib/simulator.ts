// Pure mock-telemetry engine for the real-time simulation.
//
// `simulateTick` takes the current fleet snapshot and returns the next one:
// batteries drain while driving and rise while charging, charging speeds and
// temperatures fluctuate, vehicles creep along their routes, station load
// shifts, and the aggregate KPIs / charts breathe. All randomness lives here
// and is only ever called from the client-side interval — never during render —
// so server and client first paints stay identical (no hydration mismatch).

import {
  powerConsumption as basePower,
  fleetSummary as baseSummary,
} from "./data";
import { deriveAlerts } from "./alerts";
import type {
  Vehicle,
  Station,
  VehicleStatus,
  PowerPoint,
  BatteryBand,
  FleetAlert,
} from "./types";

type Summary = typeof baseSummary;

export interface FleetSnapshot {
  vehicles: Vehicle[];
  stations: Station[];
  summary: Summary;
  powerSeries: PowerPoint[];
  batteryDistribution: BatteryBand[];
  alerts: FleetAlert[];
}

// ── helpers ──────────────────────────────────────────────
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const round1 = (n: number) => Math.round(n * 10) / 10;
// nudge a value by a random step while pulling it gently back toward a baseline
const drift = (v: number, base: number, step: number, lo: number, hi: number) =>
  clamp(v + rand(-step, step) + (base - v) * 0.05, lo, hi);

const chargingRange = (mode: Vehicle["chargingMode"]): [number, number] =>
  mode === "DC Fast Charging" ? [110, 175] : mode === "AC Charging" ? [7, 22] : [0, 0];

// ── vehicle telemetry ────────────────────────────────────
function tickVehicle(v: Vehicle): Vehicle {
  const next: Vehicle = { ...v, lastUpdated: "Just now" };
  const factor = v.battery > 0 ? v.range / v.battery : 4; // preserve efficiency

  switch (v.status) {
    case "Charging": {
      next.battery = clamp(round1(v.battery + rand(0.4, 1.1)), 0, 100);
      const [lo, hi] = chargingRange(v.chargingMode);
      next.chargingSpeedKw = Math.round(
        clamp((v.chargingSpeedKw ?? (lo + hi) / 2) + rand(-8, 8), lo, hi)
      );
      next.batteryTempC = round1(drift(v.batteryTempC ?? 30, 34, 0.6, 20, 45));
      if (next.battery >= 95) {
        next.status = "Idle";
        next.chargingMode = "Not Charging";
        next.chargingSpeedKw = 0;
      }
      break;
    }
    case "Active":
    case "En Route": {
      next.battery = clamp(round1(v.battery - rand(0.2, 0.7)), 0, 100);
      next.currentSpeedKmh = Math.round(
        clamp((v.currentSpeedKmh ?? rand(35, 85)) + rand(-7, 7), 0, 120)
      );
      next.motorTempC = round1(drift(v.motorTempC ?? 40, 48, 0.7, 25, 82));
      next.batteryTempC = round1(drift(v.batteryTempC ?? 30, 33, 0.5, 20, 45));
      // creep toward the route destination, otherwise jitter to look alive
      if (v.routeTo) {
        next.coords = [
          v.coords[0] + (v.routeTo[0] - v.coords[0]) * 0.05,
          v.coords[1] + (v.routeTo[1] - v.coords[1]) * 0.05,
        ];
        if (v.etaToStationMin != null)
          next.etaToStationMin = Math.max(0, round1(v.etaToStationMin - rand(0, 0.4)));
      } else {
        next.coords = [
          v.coords[0] + rand(-0.0008, 0.0008),
          v.coords[1] + rand(-0.0008, 0.0008),
        ];
      }
      if (next.battery < 20) next.status = "Alert";
      break;
    }
    case "Idle": {
      next.battery = clamp(round1(v.battery - rand(0, 0.12)), 0, 100); // parasitic
      next.currentSpeedKmh = 0;
      if (Math.random() < 0.04) {
        next.status = "Active"; // driver sets off
        next.currentSpeedKmh = Math.round(rand(30, 70));
      }
      break;
    }
    case "Alert": {
      // low-battery alert: occasionally the driver plugs in and recovers
      if (Math.random() < 0.08) {
        next.status = "Charging";
        next.chargingMode = "DC Fast Charging";
        next.chargingSpeedKw = Math.round(rand(110, 160));
      } else {
        next.battery = clamp(round1(v.battery - rand(0, 0.15)), 0, 100);
      }
      break;
    }
  }

  next.range = Math.round(next.battery * factor);
  return next;
}

// ── station load ─────────────────────────────────────────
function tickStation(s: Station): Station {
  const capacity = s.availablePorts + s.occupiedPorts;
  const occupied = clamp(
    s.occupiedPorts + (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.4 ? 1 : 0),
    0,
    capacity
  );
  return {
    ...s,
    occupiedPorts: occupied,
    availablePorts: capacity - occupied,
    loadPct: Math.round((occupied / capacity) * 100),
    avgWaitMin: Math.max(0, Math.round(drift(s.avgWaitMin, s.avgWaitMin, 1.2, 0, 20))),
  };
}

// ── fleet-wide aggregate KPIs (the 248-vehicle figures) ──
function tickSummary(s: Summary): Summary {
  const stationsInUse = Math.round(
    drift(s.stationsInUse, baseSummary.stationsInUse, 1.4, 18, s.stationsTotal)
  );
  return {
    ...s,
    activeVehicles: Math.round(
      drift(s.activeVehicles, baseSummary.activeVehicles, 3, 150, 220)
    ),
    vehiclesOnline: Math.round(
      drift(s.vehiclesOnline, baseSummary.vehiclesOnline, 3, 150, 230)
    ),
    chargingNow: Math.round(drift(s.chargingNow, baseSummary.chargingNow, 2, 18, 60)),
    averageBattery: Math.round(
      drift(s.averageBattery, baseSummary.averageBattery, 1, 52, 86)
    ),
    // activeAlerts is set from the derived alert feed in simulateTick
    stationsInUse,
    stationsAvailable: s.stationsTotal - stationsInUse,
    stationLoadPct: Math.round((stationsInUse / s.stationsTotal) * 100),
    co2SavedTons: round1(s.co2SavedTons + rand(0.01, 0.05)),
  };
}

// ── streaming charts ─────────────────────────────────────
function tickPowerSeries(series: PowerPoint[]): PowerPoint[] {
  return series.map((p, i) => ({
    ...p,
    kwh: Math.round(
      clamp(p.kwh + rand(-25, 25), basePower[i].kwh * 0.65, basePower[i].kwh * 1.35)
    ),
  }));
}

function tickBatteryDistribution(dist: BatteryBand[]): BatteryBand[] {
  const next = dist.map((b) => ({ ...b }));
  // move a couple of vehicles between two adjacent bands, keeping the total fixed
  const i = Math.floor(rand(0, next.length - 1));
  const move = Math.random() < 0.5 ? 1 : 2;
  if (next[i].value >= move) {
    next[i].value -= move;
    next[i + 1].value += move;
  }
  return next;
}

// ── top-level tick ───────────────────────────────────────
export function simulateTick(snapshot: FleetSnapshot): FleetSnapshot {
  const vehicles = snapshot.vehicles.map(tickVehicle);
  const alerts = deriveAlerts(vehicles, snapshot.alerts);
  return {
    vehicles,
    stations: snapshot.stations.map(tickStation),
    // the individually-tracked alert feed is the source of truth for the count
    summary: { ...tickSummary(snapshot.summary), activeAlerts: alerts.length },
    powerSeries: tickPowerSeries(snapshot.powerSeries),
    batteryDistribution: tickBatteryDistribution(snapshot.batteryDistribution),
    alerts,
  };
}
