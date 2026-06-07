"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  Zap,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAppSelector } from "@/store";
const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Fleet", href: "/fleet", icon: Car },
  { label: "Drivers", href: "/drivers", icon: Users },
  { label: "Charging", href: "/charging", icon: Zap },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const alertCount = useAppSelector((s) => s.fleet.alerts.length);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[228px] flex-col overflow-hidden bg-ev-sidebar font-sans text-ev-sidebarText shadow-[6px_0_24px_-18px_rgba(16,53,36,0.5)]">
      {/* No lightening overlays — the sidebar stays a flat solid color so it
          matches the header exactly (same bg-ev-sidebar, no gradients). */}

      {/* Logo lockup — pinned to the same 64px height as the header so the two
          top zones line up across the sidebar / content boundary. */}
      <div className="relative flex h-16 items-center px-5">
        <div className="flex items-center gap-3">
          {/* Bare logo mark — no badge background. next/image downsizes the
              1254² source to the ~36px it actually renders at, so we ship a few
              KB instead of the full PNG on first paint. */}
          <Image
            src="/sitelogo.png"
            alt="EV Dashboard — Fleet Control"
            width={36}
            height={36}
            priority
            className="h-9 w-9 shrink-0 object-contain"
          />

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span className="flex items-end">
              <span className="bg-gradient-to-b from-white via-ev-light to-ev-light/85 bg-clip-text font-sora text-[17px] font-extrabold tracking-[-0.03em] text-transparent">
                EV Dashboard
              </span>
              <span className="mb-[3px] ml-[4px] inline-block h-[5px] w-[5px] rounded-[2px] bg-ev-accent/90" />
            </span>
            <span className="mt-1.5 font-plex-mono text-[8.5px] font-medium uppercase tracking-[0.28em] text-ev-sidebarText/40">
              Fleet Control
            </span>
          </div>
        </div>
      </div>

      {/* Hairline divider */}
      <div className="relative mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Nav */}
      <nav className="relative flex-1 px-3 pt-3">
        <ul className="space-y-1">
          {navItems.map((item, i) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li
                key={item.href}
                className="ev-nav-in"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-[11px] px-3 py-2.5 text-[13px] tracking-tight transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-gradient-to-r from-ev-active/90 to-ev-active/45 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-ev-sidebarText/60 hover:translate-x-[2px] hover:bg-white/[0.04] hover:text-ev-light"
                  }`}
                >
                  {/* Hover sheen (inactive only) */}
                  {!isActive && (
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition-all duration-500 ease-out group-hover:translate-x-full group-hover:opacity-100" />
                  )}

                  {/* Active rail */}
                  <span
                    className={`pointer-events-none absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-full bg-ev-accent transition-all duration-300 ease-out ${
                      isActive
                        ? "w-[3px] opacity-90 shadow-[0_0_5px_rgba(200,230,106,0.35)]"
                        : "w-[3px] opacity-0 group-hover:h-2.5 group-hover:opacity-30"
                    }`}
                  />

                  <Icon
                    className={`h-[17px] w-[17px] shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-ev-accent/95"
                        : "text-ev-sidebarText/50 group-hover:scale-105 group-hover:text-ev-light"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.9}
                  />
                  <span
                    className={`relative flex-1 font-medium transition-colors ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.href === "/alerts" && alertCount > 0 ? (
                    <span className="ev-badge-pulse relative flex h-[21px] min-w-[21px] items-center justify-center rounded-full bg-ev-red/95 px-1.5 font-plex-mono text-[11px] font-semibold leading-none tabular-nums text-white">
                      {alertCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Green car at bottom */}
      <div
        aria-hidden
        className="pointer-events-none relative h-[220px] w-full select-none overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
        }}
      >
        {/* Decorative — lazy-loaded and downscaled so it never competes with
            the dashboard content for first-paint bandwidth. */}
        <Image
          src="/greencar.png"
          alt=""
          fill
          sizes="228px"
          loading="lazy"
          className="object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, #142210 0%, rgba(20,34,16,0.55) 55%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-12"
          style={{
            background:
              "linear-gradient(0deg, rgba(20,34,16,0.45) 0%, transparent 100%)",
          }}
        />
      </div>
    </aside>
  );
}
