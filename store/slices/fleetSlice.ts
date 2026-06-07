import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  vehicles,
  stations,
  fleetSummary,
  powerConsumption,
  batteryDistribution,
  alerts,
} from "@/lib/data";
import type {
  Vehicle,
  Station,
  VehicleStatus,
  ChargingMode,
  PowerPoint,
  BatteryBand,
  FleetAlert,
} from "@/lib/types";
import type { FleetSnapshot } from "@/lib/simulator";

type StatusFilter = "All" | VehicleStatus;

export interface AdvancedFilters {
  chargingModes: ChargingMode[]; // empty = any charging mode
  minBattery: number;
  maxBattery: number;
}

export const defaultAdvancedFilters: AdvancedFilters = {
  chargingModes: [],
  minBattery: 0,
  maxBattery: 100,
};

interface FleetState {
  vehicles: Vehicle[];
  stations: Station[];
  summary: typeof fleetSummary;
  powerSeries: PowerPoint[];
  batteryDistribution: BatteryBand[];
  alerts: FleetAlert[];
  selectedVehicleId: string | null;
  selectedStationId: string | null;
  statusFilter: StatusFilter;
  searchQuery: string;
  advancedFilters: AdvancedFilters;
}

const initialState: FleetState = {
  vehicles,
  stations,
  // keep the alert count consistent with the seeded feed from the first paint
  summary: { ...fleetSummary, activeAlerts: alerts.length },
  powerSeries: powerConsumption,
  batteryDistribution,
  alerts,
  selectedVehicleId: "EV-104",
  selectedStationId: null,
  statusFilter: "All",
  searchQuery: "",
  advancedFilters: defaultAdvancedFilters,
};

const fleetSlice = createSlice({
  name: "fleet",
  initialState,
  reducers: {
    selectVehicle(state, action: PayloadAction<string | null>) {
      state.selectedVehicleId = action.payload;
      if (action.payload) state.selectedStationId = null;
    },
    selectStation(state, action: PayloadAction<string | null>) {
      state.selectedStationId = action.payload;
      if (action.payload) state.selectedVehicleId = null;
    },
    setStatusFilter(state, action: PayloadAction<StatusFilter>) {
      state.statusFilter = action.payload;
    },
    addVehicle(state, action: PayloadAction<Vehicle>) {
      // newest first, and select it so the detail panel jumps to it
      state.vehicles.unshift(action.payload);
      state.selectedVehicleId = action.payload.id;
      state.selectedStationId = null;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setAdvancedFilters(state, action: PayloadAction<AdvancedFilters>) {
      state.advancedFilters = action.payload;
    },
    resetAdvancedFilters(state) {
      state.advancedFilters = defaultAdvancedFilters;
    },
    clearSelection(state) {
      state.selectedVehicleId = null;
      state.selectedStationId = null;
    },
    // Apply one streamed snapshot from the mock socket. Selection / filter /
    // search are intentionally left untouched so the user's current view
    // survives every tick.
    applyTick(state, action: PayloadAction<FleetSnapshot>) {
      state.vehicles = action.payload.vehicles;
      state.stations = action.payload.stations;
      state.summary = action.payload.summary;
      state.powerSeries = action.payload.powerSeries;
      state.batteryDistribution = action.payload.batteryDistribution;
      state.alerts = action.payload.alerts;
    },
    // Dismiss an alert and remediate its root cause on the vehicle, so the
    // simulator doesn't immediately re-raise the same condition next tick.
    resolveAlert(state, action: PayloadAction<string>) {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (!alert) return;
      const v = state.vehicles.find((x) => x.id === alert.vehicleId);
      if (v) {
        switch (alert.type) {
          case "Critical":
          case "Low Battery":
            v.status = "Charging";
            v.chargingMode = "DC Fast Charging";
            v.chargingSpeedKw = 150;
            break;
          case "Overheating":
            v.batteryTempC = 30;
            v.motorTempC = 35;
            break;
          case "Route Delay":
            v.currentSpeedKmh = 65;
            break;
        }
      }
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
      state.summary.activeAlerts = state.alerts.length;
    },
  },
});

export const {
  selectVehicle,
  selectStation,
  setStatusFilter,
  addVehicle,
  setSearchQuery,
  setAdvancedFilters,
  resetAdvancedFilters,
  clearSelection,
  applyTick,
  resolveAlert,
} = fleetSlice.actions;

export default fleetSlice.reducer;
