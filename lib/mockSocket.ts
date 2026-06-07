// A "simulated mock socket" (per the task spec) — a tiny streaming source built
// on setInterval that mimics a socket's connect / on / disconnect lifecycle.
// On each interval it pulls the current snapshot, runs the simulator, and pushes
// the next snapshot to every subscribed listener.

import { simulateTick, type FleetSnapshot } from "./simulator";

type Listener = (snapshot: FleetSnapshot) => void;

export function createFleetSocket(intervalMs = 2000) {
  let listeners: Listener[] = [];
  let timer: ReturnType<typeof setInterval> | null = null;

  return {
    /** Start streaming. `getSnapshot` returns the latest fleet state each tick. */
    connect(getSnapshot: () => FleetSnapshot) {
      if (timer) return;
      timer = setInterval(() => {
        const next = simulateTick(getSnapshot());
        listeners.forEach((fn) => fn(next));
      }, intervalMs);
    },
    /** Subscribe to snapshots; returns an unsubscribe function. */
    on(fn: Listener) {
      listeners.push(fn);
      return () => {
        listeners = listeners.filter((l) => l !== fn);
      };
    },
    /** Stop streaming and drop all listeners. */
    disconnect() {
      if (timer) clearInterval(timer);
      timer = null;
      listeners = [];
    },
  };
}

export type FleetSocket = ReturnType<typeof createFleetSocket>;
