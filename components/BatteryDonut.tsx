"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip } from "recharts";
import { useAppSelector } from "@/store";

// Enlarged sector drawn for whichever band is hovered.
function ActiveSector(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={2}
      />
    </g>
  );
}

export default function BatteryDonut() {
  const batteryDistribution = useAppSelector((s) => s.fleet.batteryDistribution);
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const total = batteryDistribution.reduce((a, b) => a + b.value, 0);
  const focused = active != null ? batteryDistribution[active] : null;

  return (
    <div className="rounded-2xl border border-ev-border bg-ev-card p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-ev-heading">
            Battery Distribution
          </h3>
          <p className="text-[11.5px] text-ev-mutedText">
            Hover a band · click to open the fleet
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ev-light/60 px-2.5 py-1 text-[10.5px] font-medium text-ev-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ev-primary" />
          Live
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-[160px] w-[160px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={batteryDistribution}
                dataKey="value"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                stroke="none"
                activeIndex={active ?? undefined}
                activeShape={ActiveSector}
                onMouseLeave={() => setActive(null)}
                onClick={() => router.push("/fleet")}
                className="cursor-pointer outline-none"
              >
                {batteryDistribution.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    onMouseEnter={() => setActive(i)}
                    opacity={active == null || active === i ? 1 : 0.45}
                  />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ zIndex: 50, outline: "none" }}
                allowEscapeViewBox={{ x: true, y: true }}
                contentStyle={{
                  background: "#F8F5E8",
                  border: "1px solid #D8D0B8",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 8px 24px rgba(16,53,36,0.18)",
                }}
                formatter={(v: number, _n, p: any) => [`${v} vehicles`, p?.payload?.name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-[22px] font-semibold text-ev-heading">
              {focused ? focused.value : total}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-ev-mutedText">
              {focused ? focused.name : "vehicles"}
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-1">
          {batteryDistribution.map((entry, i) => (
            <li key={entry.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => router.push("/fleet")}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-[12px] transition-colors ${
                  active === i ? "bg-ev-light/50" : "hover:bg-ev-light/30"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: entry.color }}
                  />
                  <span className="text-ev-text">{entry.name}</span>
                </span>
                <span className="font-medium text-ev-heading tabular-nums">
                  {entry.value}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
