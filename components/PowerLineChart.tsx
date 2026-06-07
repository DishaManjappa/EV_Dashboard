"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useAppSelector } from "@/store";
import { powerConsumption7d, powerConsumption30d } from "@/lib/data";

type Range = "24h" | "7d" | "30d";

const RANGES: { key: Range; label: string; note: string }[] = [
  { key: "24h", label: "24h", note: "vs yesterday" },
  { key: "7d", label: "7d", note: "vs last week" },
  { key: "30d", label: "30d", note: "vs last month" },
];

export default function PowerLineChart() {
  // 24h is the live streamed series; 7d / 30d are fixed historical ranges.
  const live24h = useAppSelector((s) => s.fleet.powerSeries);
  const [range, setRange] = useState<Range>("24h");

  const { data, note } = useMemo(() => {
    if (range === "7d") return { data: powerConsumption7d, note: "vs last week" };
    if (range === "30d") return { data: powerConsumption30d, note: "vs last month" };
    return { data: live24h, note: "vs yesterday" };
  }, [range, live24h]);

  const total = data.reduce((sum, p) => sum + p.kwh, 0);
  const isLive = range === "24h";

  return (
    <div className="rounded-2xl border border-ev-border bg-ev-card p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-ev-heading">
            Power Consumption Over Time
          </h3>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-display text-[24px] font-semibold text-ev-heading tabular-nums">
              {total.toLocaleString()}
            </span>
            <span className="text-[12px] text-ev-mutedText">kWh</span>
            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-ev-primary">
              <TrendingUp className="h-3 w-3" strokeWidth={2.4} />
              8.6% {note}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ev-light/60 px-2 py-0.5 text-[10px] font-medium text-ev-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ev-primary" />
                Live
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 text-[11px]">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              aria-pressed={range === r.key}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                range === r.key
                  ? "bg-ev-heading text-white"
                  : "text-ev-mutedText hover:bg-ev-light/40"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#315A3E" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#315A3E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5DEC6" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6B6B5F", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={12}
            />
            <YAxis
              tick={{ fill: "#6B6B5F", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 50, outline: "none" }}
              allowEscapeViewBox={{ x: false, y: true }}
              cursor={{ stroke: "#315A3E", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                background: "#F8F5E8",
                border: "1px solid #D8D0B8",
                borderRadius: 12,
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(16,53,36,0.18)",
              }}
              labelStyle={{ color: "#103524", fontWeight: 600 }}
              formatter={(v: number) => [`${v.toLocaleString()} kWh`, "Power"]}
            />
            <Area
              type="monotone"
              dataKey="kwh"
              stroke="#315A3E"
              strokeWidth={2.4}
              fill="url(#powerGradient)"
              isAnimationActive={!isLive}
              activeDot={{
                r: 4,
                fill: "#315A3E",
                stroke: "#F8F5E8",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
