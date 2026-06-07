"use client";

import { BarChart3, Leaf, DollarSign, Gauge } from "lucide-react";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import MetricCard from "@/components/MetricCard";
import PowerLineChart from "@/components/PowerLineChart";

export default function ReportsPage() {
  return (
    <>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Power Usage (mo)"
          value="328,420 kWh"
          icon={BarChart3}
          spark={[290, 305, 298, 312, 320, 318, 328]}
          delta={{ value: "4.2% vs last mo", direction: "up" }}
        />
        <MetricCard
          label="CO₂ Saved"
          value="12.4 t"
          icon={Leaf}
          spark={[9.8, 10.4, 10.9, 11.3, 11.7, 12.1, 12.4]}
          delta={{ value: "Annualized 148t", direction: "up" }}
        />
        <MetricCard
          label="Charging Cost"
          value="$48,930"
          icon={DollarSign}
          spark={[52, 51, 50.4, 49.8, 49.2, 49, 48.9]}
          delta={{ value: "2.1% lower", direction: "down" }}
        />
        <MetricCard
          label="Fleet Utilization"
          value="74%"
          icon={Gauge}
          spark={[68, 70, 71, 73, 72, 74, 74]}
          delta={{ value: "On target", direction: "up" }}
        />
      </section>

      <section className="mt-4">
        <PowerLineChart />
      </section>

      <section className="mt-4 rounded-2xl border border-ev-border bg-ev-card p-6 shadow-card">
        <h3 className="font-display text-[15px] font-semibold text-ev-heading">
          Monthly Mileage by Vehicle Class
        </h3>
        <p className="text-[11.5px] text-ev-mutedText">
          Track total kilometers covered, broken down by vehicle category.
        </p>
        <div className="mt-6 space-y-4">
          {[
            { label: "Luxury (Porsche, Audi, Mercedes)", value: 84, km: "26,420 km" },
            { label: "Premium (Tesla, BMW)", value: 92, km: "48,180 km" },
            { label: "Mid-range (Hyundai, Kia, Ford)", value: 76, km: "52,940 km" },
            { label: "Compact (Volvo)", value: 58, km: "14,210 km" },
          ].map((row) => (
            <div key={row.label} className="group">
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="text-ev-text">{row.label}</span>
                <span className="font-medium text-ev-heading">{row.km}</span>
              </div>
              <Tooltip title={`${row.value}% of fleet target · ${row.km}`} arrow placement="top">
                <LinearProgress
                  variant="determinate"
                  value={row.value}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    cursor: "pointer",
                    bgcolor: "rgba(216,208,184,0.6)",
                    transition: "height .15s",
                    "&:hover": { height: 11 },
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      bgcolor: "#315A3E",
                    },
                  }}
                />
              </Tooltip>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
