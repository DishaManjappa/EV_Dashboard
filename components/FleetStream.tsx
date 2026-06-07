"use client";

// Bridges the mock socket into Redux. Mounted once (in providers.tsx) it opens
// the stream, dispatches each snapshot via `applyTick`, and raises a toast for
// any alert that newly appears in the feed. Gated by the header's Live/Pause
// toggle (`ui.live`). Renders nothing.

import { useEffect, useRef } from "react";
import { useStore } from "react-redux";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import { applyTick } from "@/store/slices/fleetSlice";
import { pushToast } from "@/store/slices/uiSlice";
import { createFleetSocket } from "@/lib/mockSocket";
import type { FleetSnapshot } from "@/lib/simulator";
import type { AlertType, ToastTone } from "@/lib/types";

const TICK_MS = 2000;

const TONE: Record<AlertType, ToastTone> = {
  Critical: "critical",
  "Low Battery": "warning",
  Overheating: "warning",
  "Route Delay": "info",
};

export default function FleetStream() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const live = useAppSelector((s) => s.ui.live);
  const knownAlertIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!live) return;

    // seed known ids with what's already on screen so pre-existing alerts
    // don't toast on load / resume
    knownAlertIds.current = new Set(
      store.getState().fleet.alerts.map((a) => a.id)
    );

    const socket = createFleetSocket(TICK_MS);
    const snapshot = (): FleetSnapshot => {
      const {
        vehicles,
        stations,
        summary,
        powerSeries,
        batteryDistribution,
        alerts,
      } = store.getState().fleet;
      return { vehicles, stations, summary, powerSeries, batteryDistribution, alerts };
    };

    const off = socket.on((snap) => {
      dispatch(applyTick(snap));
      for (const a of snap.alerts) {
        if (!knownAlertIds.current.has(a.id)) {
          dispatch(
            pushToast({
              id: a.id,
              title: a.type,
              message: `${a.vehicleId} — ${a.message}`,
              tone: TONE[a.type],
            })
          );
        }
      }
      knownAlertIds.current = new Set(snap.alerts.map((a) => a.id));
    });
    socket.connect(snapshot);

    return () => {
      off();
      socket.disconnect();
    };
  }, [live, dispatch, store]);

  return null;
}
