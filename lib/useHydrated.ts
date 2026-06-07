"use client";

import { useEffect, useState } from "react";

// Returns false during SSR and the first client render, then true after mount.
//
// Use it to gate live, per-tick store values (battery, timestamps, counts…)
// behind the seed data so the first client paint is byte-identical to the
// server HTML — otherwise the simulator's ticks race hydration and React throws
// "Text content does not match server-rendered HTML".
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
