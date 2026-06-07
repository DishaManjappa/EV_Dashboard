"use client";

import { MapPin } from "lucide-react";

/**
 * Branded placeholder shown while the map's JS chunk downloads (via FleetMap's
 * dynamic `loading`) and while the first tiles fetch (FleetMapInner's ready
 * gate). `fading` triggers the fade-out once tiles are in.
 */
export default function MapSkeleton({
  label = "Loading map…",
  fading = false,
}: {
  label?: string;
  fading?: boolean;
}) {
  return (
    <div
      className={`ev-map-skeleton absolute inset-0 z-[600] flex flex-col items-center justify-center gap-3 ${
        fading ? "ev-map-overlay-fade" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ev-border bg-ev-card shadow-card">
        <MapPin className="h-5 w-5 text-ev-primary" />
        <span className="absolute inset-0 animate-ping rounded-full border border-ev-primary/40" />
      </div>
      <span className="text-[12px] font-medium text-ev-mutedText">{label}</span>
    </div>
  );
}
