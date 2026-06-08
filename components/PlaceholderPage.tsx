"use client";

import { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export default function PlaceholderPage({
  icon: Icon,
  title,
  description,
  features,
}: PlaceholderPageProps) {
  return (
    <div className="rounded-3xl border border-ev-border bg-ev-card p-6 shadow-card sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ev-light/60 text-ev-primary">
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <h2 className="mt-5 font-display text-[28px] font-semibold text-ev-heading">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ev-mutedText">
        {description}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        {features.map((f) => (
          <div
            key={f}
            className="flex items-start gap-3 rounded-2xl border border-ev-border/70 bg-white/40 px-4 py-3"
          >
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ev-primary" />
            <span className="text-[13px] text-ev-text">{f}</span>
          </div>
        ))}
      </div>

      
    </div>
  );
}
