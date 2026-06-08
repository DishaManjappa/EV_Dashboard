"use client";

// Header notification bell. The badge counts unread alerts (those not yet
// opened); clicking the bell opens a dropdown of the live alert feed. Opening an
// alert acknowledges it (badge goes down) and jumps to the fleet view with that
// vehicle selected.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, AlertTriangle, Battery, Thermometer, MapPin } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store";
import { acknowledgeAlert, acknowledgeAlerts } from "@/store/slices/uiSlice";
import { selectVehicle } from "@/store/slices/fleetSlice";
import type { AlertType } from "@/lib/types";

const ICONS: Record<AlertType, typeof Bell> = {
  Critical: AlertTriangle,
  "Low Battery": Battery,
  Overheating: Thermometer,
  "Route Delay": MapPin,
};

const TONE: Record<AlertType, string> = {
  Critical: "bg-ev-lightRed/70 text-ev-red",
  "Low Battery": "bg-ev-lightYellow/70 text-ev-yellow",
  Overheating: "bg-ev-lightYellow/70 text-ev-yellow",
  "Route Delay": "bg-ev-light/60 text-ev-primary",
};

export default function NotificationBell() {
  const alerts = useAppSelector((s) => s.fleet.alerts);
  const vehicles = useAppSelector((s) => s.fleet.vehicles);
  const seen = useAppSelector((s) => s.ui.seenAlertIds);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = alerts.filter((a) => !seen.includes(a.id));
  const unreadCount = unread.length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openAlert = (id: string, vehicleId: string) => {
    dispatch(acknowledgeAlert(id));
    dispatch(selectVehicle(vehicleId));
    setOpen(false);
    router.push("/fleet");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full text-ev-light transition-colors ${
          open ? "bg-white/[0.10]" : "hover:bg-white/[0.07]"
        }`}
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-ev-red px-1 font-plex-mono text-[9px] font-bold tabular-nums leading-none text-white ring-2 ring-ev-sidebar">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2.5 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-ev-border bg-ev-card text-ev-text shadow-panel">
          <div className="flex items-center justify-between border-b border-ev-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-[13.5px] font-semibold text-ev-heading">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-ev-red/10 px-1.5 py-0.5 font-plex-mono text-[10px] font-semibold text-ev-red">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => dispatch(acknowledgeAlerts(unread.map((a) => a.id)))}
                className="text-[11px] font-medium text-ev-primary transition-colors hover:text-ev-heading"
              >
                Mark all read
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-ev-light/50 text-ev-primary">
                <Bell className="h-4 w-4" strokeWidth={2} />
              </div>
              <p className="text-[12px] font-medium text-ev-heading">All clear</p>
              <p className="text-[11px] text-ev-mutedText">No active alerts</p>
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto">
              {alerts.map((a) => {
                const Icon = ICONS[a.type];
                const v = vehicles.find((x) => x.id === a.vehicleId);
                const isUnread = !seen.includes(a.id);
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => openAlert(a.id, a.vehicleId)}
                      className="flex w-full items-start gap-3 border-b border-ev-border/40 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/40"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TONE[a.type]}`}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.1} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-ev-heading">
                            {a.type}
                          </span>
                          {isUnread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-ev-red" />
                          )}
                          <span className="ml-auto shrink-0 font-plex-mono text-[10px] text-ev-mutedText">
                            {a.time}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-ev-mutedText">
                          {v ? `${v.id} · ${v.model}` : a.vehicleId}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-ev-text/80">
                          {a.message}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/alerts");
            }}
            className="block w-full border-t border-ev-border/70 px-4 py-2.5 text-center text-[12px] font-medium text-ev-primary transition-colors hover:bg-white/40"
          >
            View all alerts
          </button>
        </div>
      )}
    </div>
  );
}
