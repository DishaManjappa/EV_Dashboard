"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectVehicle, selectStation } from "@/store/slices/fleetSlice";
import type { VehicleStatus } from "@/lib/types";
import MapSkeleton from "./MapSkeleton";

const STATUS_COLOR: Record<VehicleStatus, string> = {
  Active: "#315A3E",
  Idle: "#A8A8A0",
  Charging: "#D6A534",
  Alert: "#B64432",
  "En Route": "#7F9B74",
};

// Small car glyph reused from the fleet table, drawn inside each marker so the
// vehicle's *icon* (not just its colour) reads at a glance.
const CAR_SVG = `<svg viewBox="0 0 24 14" fill="currentColor"><path d="M2 9 Q 3 4 7 3.5 L 13 3 Q 17 2.8 19 5 L 21 7 L 21 10 Q 21 11 20 11 L 18 11 Q 17.6 12.5 16 12.5 Q 14.4 12.5 14 11 L 8 11 Q 7.6 12.5 6 12.5 Q 4.4 12.5 4 11 L 3 11 Q 2 11 2 10 Z"/></svg>`;

// Cache icons by status+selected so a marker's icon reference stays stable
// across telemetry ticks (only its position changes). That lets Leaflet move
// the existing element — keeping the CSS glide and the alert pulse running —
// instead of rebuilding the DOM every two seconds.
const ICON_CACHE = new Map<string, L.DivIcon>();

/** Build a status-aware marker: coloured dot + car glyph, an alert pulse ring,
 *  a charging bolt badge, and an enlarged ring when selected. */
function vehicleIcon(status: VehicleStatus, selected: boolean): L.DivIcon {
  const key = `${status}|${selected}`;
  const cached = ICON_CACHE.get(key);
  if (cached) return cached;

  const color = STATUS_COLOR[status];
  const pulse = status === "Alert" ? `<span class="ev-vmarker__pulse"></span>` : "";
  const bolt = status === "Charging" ? `<span class="ev-vmarker__bolt">⚡</span>` : "";
  const icon = L.divIcon({
    className: "ev-vmarker-wrap",
    html: `<div class="ev-vmarker ${selected ? "is-selected" : ""}" style="--c:${color}">
      ${pulse}<span class="ev-vmarker__dot">${CAR_SVG}</span>${bolt}
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    tooltipAnchor: [0, -16],
  });
  ICON_CACHE.set(key, icon);
  return icon;
}

const stationIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 22px; height: 22px; border-radius: 6px;
    background: #103524; color: #F3EEDC;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(16,53,36,0.3);
    border: 2px solid #F8F5E8;
    font-size: 12px; font-weight: 600;
  ">⚡</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

interface FleetMapInnerProps {
  height?: number | string;
  variant?: "preview" | "full";
  showRoute?: boolean;
}

type TileState = "loading" | "ready" | "error";

export default function FleetMapInner({
  height = 320,
  variant = "full",
  showRoute = true,
}: FleetMapInnerProps) {
  const dispatch = useAppDispatch();
  const { vehicles, stations, selectedVehicleId } = useAppSelector(
    (s) => s.fleet
  );

  const [map, setMap] = useState<L.Map | null>(null);
  const [tiles, setTiles] = useState<TileState>("loading");
  const didFit = useRef(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Frame every vehicle + station in view. Used once on first render and again
  // whenever the operator hits "Recenter".
  const fitToFleet = useCallback(() => {
    if (!map) return;
    const points = [
      ...vehicles.map((v) => v.coords),
      ...stations.map((s) => s.coords),
    ];
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true });
  }, [map, vehicles, stations]);

  // Initial framing — once the map exists. We deliberately don't refit on every
  // telemetry tick, so the operator's pan/zoom is never yanked around.
  useEffect(() => {
    if (map && !didFit.current) {
      fitToFleet();
      didFit.current = true;
    }
  }, [map, fitToFleet]);

  // Safety net: if the TileLayer's `load` event never arrives (cached tiles,
  // flaky network), drop the loading overlay anyway after a short grace period.
  useEffect(() => {
    if (tiles !== "loading") return;
    const t = setTimeout(() => setTiles("ready"), 4000);
    return () => clearTimeout(t);
  }, [tiles]);

  const tileHandlers = useMemo(
    () => ({
      load: () => setTiles((prev) => (prev === "error" ? prev : "ready")),
      tileerror: () => setTiles("error"),
    }),
    []
  );

  return (
    <div className="relative" style={{ height, width: "100%" }}>
      <MapContainer
        ref={setMap}
        center={[37.55, -122.05]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        zoomControl={variant === "full"}
        attributionControl={false}
        scrollWheelZoom={variant === "full"}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution=""
          eventHandlers={tileHandlers}
        />

        {/* Route polyline for the selected vehicle */}
        {showRoute && selectedVehicle?.routeTo && (
          <Polyline
            positions={[selectedVehicle.coords, selectedVehicle.routeTo]}
            pathOptions={{
              color: "#315A3E",
              weight: 3,
              dashArray: "6 6",
              opacity: 0.7,
            }}
          />
        )}

        {/* Charging stations */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={station.coords}
            icon={stationIcon}
            eventHandlers={{
              click: () => dispatch(selectStation(station.id)),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <span className="text-xs font-medium">{station.name}</span>
            </Tooltip>
          </Marker>
        ))}

        {/* Vehicle markers — icon + colour driven by current status */}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={vehicle.coords}
            icon={vehicleIcon(vehicle.status, vehicle.id === selectedVehicleId)}
            zIndexOffset={vehicle.id === selectedVehicleId ? 1000 : 0}
            eventHandlers={{
              click: () => dispatch(selectVehicle(vehicle.id)),
            }}
          >
            <Tooltip direction="top" offset={[0, -16]}>
              <span className="text-xs">
                <strong>{vehicle.id}</strong> · {vehicle.status} ·{" "}
                {vehicle.battery}%
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Recenter control (hidden in the compact preview) */}
      {variant === "full" && (
        <button
          type="button"
          className="ev-map-recenter"
          onClick={fitToFleet}
          aria-label="Recenter map on the fleet"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          Recenter
        </button>
      )}

      {/* Tile loading / error gate */}
      {tiles === "error" ? (
        <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center gap-2 bg-ev-card/90 text-center">
          <span className="text-[13px] font-medium text-ev-heading">
            Map tiles failed to load
          </span>
          <span className="text-[11.5px] text-ev-mutedText">
            Vehicle positions are still live below.
          </span>
          <button
            type="button"
            onClick={() => setTiles("loading")}
            className="mt-1 rounded-full border border-ev-border bg-white/60 px-3 py-1 text-[11.5px] font-medium text-ev-heading hover:bg-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <MapSkeleton fading={tiles === "ready"} />
      )}
    </div>
  );
}
