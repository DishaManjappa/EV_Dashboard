"use client";

import dynamic from "next/dynamic";
import MapSkeleton from "./MapSkeleton";

// Leaflet touches `window` on import, so the whole map tree is client-only.
// While its chunk downloads we show the branded skeleton instead of a flash of
// empty space.
const FleetMapInner = dynamic(() => import("./FleetMapInner"), {
  ssr: false,
  loading: () => (
    <div className="relative h-full w-full">
      <MapSkeleton />
    </div>
  ),
});

export default FleetMapInner;
