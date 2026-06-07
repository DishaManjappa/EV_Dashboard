export type VehicleStatus = "Active" | "Idle" | "Charging" | "En Route" | "Alert";

export type ChargingMode = "DC Fast Charging" | "AC Charging" | "Not Charging";

export interface Vehicle {
  id: string;
  model: string;
  driver: string;
  status: VehicleStatus;
  battery: number;
  range: number;
  chargingMode: ChargingMode;
  location: string;
  lastUpdated: string;
  coords: [number, number]; // [lat, lng]
  batteryTempC?: number;
  motorTempC?: number;
  chargingSpeedKw?: number;
  lastServiceDate?: string;
  serviceHistory?: { label: string; date: string }[];
  etaToStationMin?: number;
  currentSpeedKmh?: number;
  routeTo?: [number, number];
}

export interface Station {
  id: string;
  name: string;
  coords: [number, number];
  availablePorts: number;
  occupiedPorts: number;
  loadPct: number;
  avgWaitMin: number;
}

export type AlertType = "Critical" | "Low Battery" | "Overheating" | "Route Delay";

export interface FleetAlert {
  id: string; // `${vehicleId}-${type}` — stable, so an active condition isn't duplicated
  vehicleId: string;
  type: AlertType;
  message: string;
  time: string;
}

export type ToastTone = "critical" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  message: string;
  tone: ToastTone;
}

export interface PowerPoint {
  time: string;
  kwh: number;
}

export interface BatteryBand {
  name: string;
  value: number;
  color: string;
}
