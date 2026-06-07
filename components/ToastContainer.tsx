"use client";

// Renders the live alert toasts in the top-right corner. Each auto-dismisses
// after a few seconds; clicking one "opens" the alert (acknowledges it, which
// decrements the header bell) and jumps to the Alerts page.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Battery, Thermometer, MapPin, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { dismissToast, acknowledgeAlert } from "@/store/slices/uiSlice";
import type { Toast, ToastTone } from "@/lib/types";

const TONE_STYLES: Record<ToastTone, string> = {
  critical: "border-ev-red/30 bg-ev-lightRed/80 text-ev-red",
  warning: "border-ev-yellow/40 bg-ev-lightYellow/80 text-ev-yellow",
  info: "border-ev-border bg-ev-card text-ev-mutedText",
};

const ICONS = {
  Critical: AlertTriangle,
  "Low Battery": Battery,
  Overheating: Thermometer,
  "Route Delay": MapPin,
} as const;

const AUTO_DISMISS_MS = 5500;

function ToastItem({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const Icon = ICONS[toast.title as keyof typeof ICONS] ?? AlertTriangle;

  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(toast.id)), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [dispatch, toast.id]);

  const open = () => {
    dispatch(acknowledgeAlert(toast.id));
    dispatch(dismissToast(toast.id));
    router.push("/alerts");
  };

  return (
    <div
      role="status"
      onClick={open}
      className="ev-toast-in pointer-events-auto flex w-[330px] cursor-pointer items-start gap-3 rounded-2xl border border-ev-border bg-ev-card p-3.5 shadow-panel transition-transform hover:-translate-y-0.5"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          TONE_STYLES[toast.tone]
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.1} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12.5px] font-semibold text-ev-heading">
            {toast.title}
          </span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(dismissToast(toast.id));
            }}
            className="shrink-0 rounded-full p-0.5 text-ev-mutedText transition-colors hover:bg-ev-border/40 hover:text-ev-heading"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-ev-mutedText">
          {toast.message}
        </p>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts);

  return (
    <div className="pointer-events-none fixed right-5 top-20 z-50 flex flex-col gap-2.5">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
