"use client";

import { X, Zap, Clock, Plug } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearSelection } from "@/store/slices/fleetSlice";

export default function StationDetailPanel() {
  const dispatch = useAppDispatch();
  const station = useAppSelector((s) =>
    s.fleet.stations.find((st) => st.id === s.fleet.selectedStationId)
  );

  if (!station) return null;

  const totalPorts = station.availablePorts + station.occupiedPorts;

  return (
    <div className="overflow-hidden rounded-2xl border border-ev-border bg-ev-card shadow-card">
      <div className="flex items-center justify-between border-b border-ev-border/70 px-5 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ev-mutedText">
            Selected Charging Station
          </div>
          <div className="font-display text-[18px] font-semibold text-ev-heading">
            {station.name}
          </div>
        </div>
        <button
          onClick={() => dispatch(clearSelection())}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-ev-border bg-white/40 text-ev-mutedText hover:bg-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-5">
        {/* Port breakdown */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-ev-border/50 bg-ev-light/40 p-3">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-ev-mutedText">
              <Plug className="h-3 w-3" />
              Available
            </div>
            <div className="mt-1 font-display text-[22px] font-semibold text-ev-primary">
              {station.availablePorts}
            </div>
          </div>
          <div className="rounded-xl border border-ev-border/50 bg-ev-lightYellow/50 p-3">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-ev-mutedText">
              <Zap className="h-3 w-3" />
              Occupied
            </div>
            <div className="mt-1 font-display text-[22px] font-semibold text-ev-yellow">
              {station.occupiedPorts}
            </div>
          </div>
        </div>

        {/* Load */}
        <div className="mt-4 rounded-xl border border-ev-border/50 bg-white/40 p-3">
          <div className="flex items-center justify-between text-[11px] text-ev-mutedText">
            <span>Station Load</span>
            <span className="font-medium text-ev-heading">
              {station.loadPct}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-ev-border/60">
            <div
              className={`h-full rounded-full ${
                station.loadPct > 75
                  ? "bg-ev-red"
                  : station.loadPct > 50
                    ? "bg-ev-yellow"
                    : "bg-ev-primary"
              }`}
              style={{ width: `${station.loadPct}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11.5px]">
            <span className="text-ev-mutedText">Total ports</span>
            <span className="font-medium text-ev-heading">{totalPorts}</span>
          </div>
        </div>

        {/* Wait time */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-ev-border/50 bg-white/40 px-3 py-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-ev-mutedText" />
            <span className="text-[12px] text-ev-mutedText">Average wait</span>
          </div>
          <span className="font-display text-[15px] font-semibold text-ev-heading">
            {station.avgWaitMin} min
          </span>
        </div>

        <button className="mt-5 w-full rounded-full bg-ev-heading py-2.5 text-[12.5px] font-medium text-white hover:bg-ev-primary">
          View Station
        </button>
      </div>
    </div>
  );
}
