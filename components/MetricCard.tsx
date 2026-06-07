"use client";

import Link from "next/link";
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; direction: "up" | "down" };
  icon?: LucideIcon;
  variant?: "default" | "alert";
  /** When set, the whole card becomes a drill-through link. */
  href?: string;
  /** Small values driving the inline sparkline (left→right, oldest→newest). */
  spark?: number[];
}

// Builds an SVG path for the sparkline from a list of values, normalised into a
// 100×28 viewbox. Pure + deterministic so it's hydration-safe.
function sparkPath(values: number[], w = 100, h = 28) {
  if (values.length < 2) return { line: "", area: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = h - 2 - ((v - min) / span) * (h - 4);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return { line, area };
}

export default function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  variant = "default",
  href,
  spark,
}: MetricCardProps) {
  const isAlert = variant === "alert";
  const sparkId = `spark-${label.replace(/[^a-z0-9]/gi, "")}`;
  const { line, area } = spark ? sparkPath(spark) : { line: "", area: "" };
  const sparkColor = isAlert ? "#B64432" : "#315A3E";

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span
          className={`text-[11.5px] uppercase tracking-wider ${
            isAlert ? "text-ev-red" : "text-ev-mutedText"
          }`}
        >
          {label}
        </span>
        {href ? (
          <ArrowUpRight
            className={`h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 ${
              isAlert ? "text-ev-red" : "text-ev-primary"
            }`}
            strokeWidth={2.2}
          />
        ) : Icon ? (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full ${
              isAlert ? "bg-ev-red/10 text-ev-red" : "bg-ev-light/60 text-ev-primary"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div
          className={`font-display text-[28px] font-semibold leading-none transition-colors ${
            isAlert ? "text-ev-red" : "text-ev-heading"
          }`}
        >
          {value}
        </div>
        {spark && line ? (
          <svg
            viewBox="0 0 100 28"
            preserveAspectRatio="none"
            className="h-7 w-[88px] shrink-0 opacity-80"
            aria-hidden
          >
            <defs>
              <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkColor} stopOpacity={0.28} />
                <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${sparkId})`} />
            <path
              d={line}
              fill="none"
              stroke={sparkColor}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>

      {delta ? (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium ${
            delta.direction === "up" ? "text-ev-primary" : "text-ev-red"
          }`}
        >
          {delta.direction === "up" ? (
            <TrendingUp className="h-3 w-3" strokeWidth={2.4} />
          ) : (
            <TrendingDown className="h-3 w-3" strokeWidth={2.4} />
          )}
          {delta.value}
        </div>
      ) : null}
    </>
  );

  const base = `group block rounded-2xl border p-5 shadow-card ${
    isAlert ? "border-ev-lightRed bg-ev-lightRed/40" : "border-ev-border bg-ev-card"
  }`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-ev-primary/40 hover:shadow-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-ev-primary/30`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={base}>{inner}</div>;
}
