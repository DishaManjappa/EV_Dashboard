"use client";

import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import { useAppSelector } from "@/store";

export default function ChargingGauge() {
  const { stationLoadPct, stationsTotal, stationsInUse, stationsAvailable } =
    useAppSelector((s) => s.fleet.summary);

  // semi-circle gauge math
  const radius = 70;
  const circumference = Math.PI * radius;
  const progress = (stationLoadPct / 100) * circumference;

  const tiles = [
    {
      value: stationsTotal,
      label: "Total",
      tip: "All charging stations in the network",
      wrap: "border-ev-border/50 bg-white/40",
      text: "text-ev-heading",
    },
    {
      value: stationsInUse,
      label: "In Use",
      tip: "Stations with at least one occupied port",
      wrap: "border-ev-border/50 bg-ev-lightYellow/50",
      text: "text-ev-yellow",
    },
    {
      value: stationsAvailable,
      label: "Available",
      tip: "Stations with free ports right now",
      wrap: "border-ev-border/50 bg-ev-light/40",
      text: "text-ev-primary",
    },
  ];

  return (
    <div className="rounded-2xl border border-ev-border bg-ev-card p-5 shadow-card">
      <div className="mb-2">
        <h3 className="font-display text-[15px] font-semibold text-ev-heading">
          Charging Station Load
        </h3>
        <p className="text-[11.5px] text-ev-mutedText">
          Average utilization across network
        </p>
      </div>

      <div className="flex flex-col items-center pt-2">
        <svg viewBox="0 0 180 100" className="h-[110px] w-[180px]" overflow="visible">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            stroke="#E5DEC6"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            stroke="#D6A534"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            style={{ transition: "stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="-mt-6 text-center">
          <div className="font-display text-[26px] font-semibold text-ev-heading tabular-nums">
            {stationLoadPct}%
          </div>
          <div className="text-[10.5px] uppercase tracking-wider text-ev-mutedText">
            avg utilization
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {tiles.map((t) => (
          <Tooltip key={t.label} title={t.tip} arrow>
            <Link
              href="/charging"
              className={`rounded-xl border px-2 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${t.wrap}`}
            >
              <div className={`font-display text-[16px] font-semibold tabular-nums ${t.text}`}>
                {t.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-ev-mutedText">
                {t.label}
              </div>
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
