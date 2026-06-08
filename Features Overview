# Features — EV Fleet & System Dashboard

A detailed walkthrough of everything the dashboard does: each feature, how it's
**interactive**, and how it adapts to be **responsive on mobile**.

---

## Table of Contents

1. [Real-Time Data Engine](#1-real-time-data-engine)
2. [Application Shell — Sidebar & Header](#2-application-shell--sidebar--header)
3. [Page 1 — Dashboard Overview](#3-page-1--dashboard-overview)
4. [Page 2 — Fleet & User Management](#4-page-2--fleet--user-management)
5. [Page 3 — Map & Charging Network](#5-page-3--map--charging-network)
6. [Alerts](#6-alerts)
7. [Reports](#7-reports)
8. [Drivers & Settings](#8-drivers--settings)
9. [Notifications & Toasts](#9-notifications--toasts)
10. [Mobile Responsiveness — How It Works](#10-mobile-responsiveness--how-it-works)
11. [Performance & Engineering Details](#11-performance--engineering-details)

---

## 1. Real-Time Data Engine

The dashboard is **alive** — it isn't a static mockup. A simulated streaming
source pushes a fresh fleet snapshot into the Redux store every **2 seconds**.

**How it works**
- `lib/mockSocket.ts` mimics a real socket lifecycle (`connect` / `on` /
  `disconnect`) using `setInterval`.
- `lib/simulator.ts` is a pure function that advances the fleet one "tick" —
  vehicles move, batteries drain/charge, statuses change, station load shifts,
  and new alerts appear.
- `components/FleetStream.tsx` (mounted once, renders nothing) bridges the stream
  into Redux via `applyTick`, and raises a toast whenever a *new* alert appears.

**Interactivity**
- Every KPI, chart, map marker, table row, and badge **reacts automatically** to
  each tick — no manual refresh.
- The header's **Live / Paused toggle** genuinely starts and stops the stream
  (`ui.live`), and the "Synced HH:MM:SS" clock and the spinning sync icon reflect
  the live state.

---

## 2. Application Shell — Sidebar & Header

The shell is rendered **once** in the root layout and persists across navigation,
so it never unmounts or replays animations — page changes feel instant.

### Sidebar (`components/Sidebar.tsx`)
- Brand logo + wordmark, and primary navigation: **Overview, Fleet, Drivers,
  Charging, Alerts, Reports, Settings**.
- **Active route** is highlighted with a rounded green pill, an accent rail, and
  an icon color/weight change.
- The **Alerts** item shows a live **red badge** with the current alert count
  (pulsing) — driven straight from `fleet.alerts`.
- Nav items animate in with a staggered entrance; a decorative car image anchors
  the bottom.

### Header (`components/Header.tsx`)
- **Breadcrumb** mirroring the active section.
- **Live / Paused** stream toggle (with an animated ping dot).
- **Region** chip and **Last-Sync** chip with a live clock.
- **Date · Time** chip updating every second.
- **Notification bell** (see §9) and an **admin profile** button that opens a menu
  (Profile, Settings, Sign out).

**Mobile behavior:** the sidebar becomes an off-canvas drawer and the header gains
a hamburger toggle — see [§10](#10-mobile-responsiveness--how-it-works).

---

## 3. Page 1 — Dashboard Overview

A single-glance summary of the whole fleet.

**Components & interactivity**
- **KPI Metric Cards** — Total EVs, Active Vehicles, Charging Now, Average
  Battery, Active Alerts. Each card:
  - shows a live value, a **trend delta** (up/down), and an **inline SVG
    sparkline**;
  - is a **drill-through link** (e.g. Active Alerts → `/alerts`) with a hover
    lift + arrow reveal.
- **Battery Distribution donut** (Recharts) — hover a band to enlarge it and see
  the count in the center; click to open the fleet view.
- **Power Consumption chart** — area chart with **24h / 7d / 30d** range toggles
  (24h is the live streamed series); hover for a tooltip with exact kWh.
- **Charging Station Load gauge** — animated semi-circle gauge plus Total / In-Use
  / Available tiles that link to the charging page.
- **Fleet Map preview** — a compact live Leaflet map with a legend and a "Full
  map" link.
- **Recent Fleet Activity table** — latest vehicles; click a row to jump into the
  Fleet page with that vehicle selected.

**Responsive:** metric cards reflow `5 → 3 → 2` columns; the map/chart row stacks;
the map header stacks its title above the legend on small screens.

---

## 4. Page 2 — Fleet & User Management

The operational workhorse for managing EVs and their drivers.

**Components & interactivity**
- **Toolbar** (`FleetToolbar`):
  - **Search** by vehicle ID, driver, or model (live filtering);
  - **Status filter** toggle group (All / Idle / Charging / En Route / Alert) with
    live counts per status;
  - **Advanced Filters** popover — a **battery-range slider** and **charging-mode**
    checkboxes, applied on commit, with an active-filter count badge;
  - **Add Vehicle** dialog — a validated form (duplicate-ID detection, required
    fields, battery clamping) that dispatches a new vehicle into the store.
- **Fleet Table** (`FleetTable`):
  - **Sortable** columns (ID, model, driver, status, battery, range);
  - **Pagination** (10 / 25 / 50 rows);
  - per-row battery bar with color thresholds, status badge, and vehicle thumbnail;
  - **click a row** to select that vehicle.
- **Vehicle Detail Panel** (`VehicleDetailPanel`) — a slide-in diagnostics panel:
  battery %, range, **battery/motor temperature** (with warning colors), charging
  speed, last service date, **service history**, and quick actions (Send to
  Charge, Contact Driver, View on Map). Closing it collapses the column so the
  table reclaims full width.

**Responsive:** the layout goes single-column (table on top, detail panel below);
the wide table becomes **horizontally scrollable** inside its card; the search bar
goes full-width with the filter controls wrapping beneath it.

---

## 5. Page 3 — Map & Charging Network

A geographic view of the fleet and charging infrastructure.

**Components & interactivity**
- **KPI cards** — Vehicles Online, Vehicles Charging, Active Alerts, Stations In
  Use.
- **Interactive Leaflet Map** (`FleetMapInner`):
  - **Status-colored vehicle markers** with a car glyph; an **alert pulse** ring
    on alerting vehicles and a **charging bolt** badge on charging ones;
  - **charging-station markers**;
  - a **route polyline** for the selected vehicle;
  - hover **tooltips** (ID · status · battery);
  - **click any marker** to open its detail panel;
  - a floating **Recenter** control that re-frames the whole fleet;
  - a **tile loading/error gate** with retry, so a flaky network never leaves a
    blank map.
- **Detail panels** on the right:
  - **MapVehiclePanel** — driver, battery, range, ETA to station, current speed,
    location, plus Contact Driver / Track Route;
  - **StationDetailPanel** — available vs. occupied ports, station load bar,
    average wait time, total ports.

**Responsive:** the panel stacks below the map; the map height shrinks on phones;
the map legend moves into a floating pill at the bottom of the map on small
screens.

---

## 6. Alerts

A live incident feed for everything needing attention.

**Components & interactivity**
- **Summary cards** by type (Critical, Low Battery, Overheating, Route Delay) with
  live counts.
- **Incident list** — each row shows the vehicle, model, alert type, message,
  location, time, battery, and status.
  - **Click a row** to acknowledge it and jump to the Fleet page with that vehicle
    selected (inspect workflow);
  - **Resolve** button dispatches `resolveAlert`, removing it from the feed and
    decrementing the sidebar badge.
- An **"all clear"** empty state when there are no active alerts.

**Responsive:** summary cards go `4 → 2` columns; row spacing tightens and the
metadata wraps cleanly; the battery column hides on the smallest screens.

---

## 7. Reports

Energy and efficiency analytics.

**Components & interactivity**
- **KPI cards** — Power Usage (mo), CO₂ Saved, Charging Cost, Fleet Utilization,
  each with sparklines and deltas.
- **Power Consumption chart** with range toggles (reused from Overview).
- **Monthly mileage by vehicle class** — animated MUI progress bars with hover
  tooltips showing percentage of target and total km.

**Responsive:** KPI cards reflow `4 → 2`; the chart and breakdown stack.

---

## 8. Drivers & Settings

Structured **placeholder pages** that communicate the intended scope (driver
profiles, EV assignment, trip history, behavior scores; account/security,
notification channels, alert-rule engine, RBAC, API keys, audit log). They share
a polished `PlaceholderPage` component with a feature grid.

**Responsive:** padding reduces on mobile and the feature grid goes single-column.

---

## 9. Notifications & Toasts

**Notification Bell** (`NotificationBell`)
- Counts **unread** alerts (those not yet opened) on a red badge.
- Opens a dropdown of the live alert feed; **clicking an alert** acknowledges it
  and jumps to the Fleet page with that vehicle selected.
- **"Mark all read"** clears the unread count; **"View all alerts"** routes to the
  Alerts page.
- Closes on outside-click.

**Toasts** (`ToastContainer`)
- New alerts streamed in raise a **toast** in the top-right that **auto-dismisses**
  after ~5.5s.
- Clicking a toast acknowledges the alert and opens the Alerts page; an explicit
  dismiss (✕) is also available. Capped to the 4 most recent.

**Responsive:** the dropdown and toasts are width-capped to
`calc(100vw - 2rem)` so they never overflow a narrow viewport.

---

## 10. Mobile Responsiveness — How It Works

The entire app is usable from large desktop down to small phones. The
implementation is **mobile-first with Tailwind breakpoints** (`sm`, `md`, `lg`).

### Layout shell
- On desktop (`lg+`) the sidebar is **permanently docked** at `228px` and the
  content sits at `lg:ml-[228px]`.
- Below `lg`, the sidebar becomes an **off-canvas drawer**:
  - hidden via `-translate-x-full`, slid in via `translate-x-0`;
  - opened by a **hamburger button** in the header (visible only `< lg`);
  - closed by tapping the **blurred backdrop**, the **✕ button**, or **any nav
    link** (so navigation auto-dismisses the drawer);
  - state is held in Redux (`ui.mobileNavOpen`), defaulting closed to match SSR
    and avoid hydration mismatch.
- Content padding is **fluid**: `px-4 → sm:px-6 → lg:px-8`.

### Header
- Gains the hamburger; chip cluster collapses progressively (region/sync/date
  chips hide at smaller breakpoints; the avatar label hides, keeping the avatar).
- The breadcrumb collapses to a **single, non-overflowing section label** on
  mobile (home icon + separator hidden, with an ellipsis safety net so it can
  never overlap the right-hand controls).

### Grids & content
- **Metric grids** reflow: `lg:grid-cols-5 → md:grid-cols-3 → grid-cols-2`
  (and `4 → 2` on the charging/alerts/reports pages).
- **Multi-column page layouts** (table + detail panel, map + panel) **stack** into
  a single column.

### Tables
- The wide **Fleet** (9 cols) and **Activity** (6 cols) tables get a `min-width`
  and become **horizontally scrollable inside their card**, so columns stay
  readable instead of being crushed.

### Charts, map & KPI cards
- Charts and the map use **fluid heights** (e.g. the charging map is
  `h-[440px] sm:h-[560px]`).
- KPI **sparklines reflow** to sit **full-width beneath the value** on narrow
  cards (side-by-side again from `sm`), and long values like "176 of 248" scale
  down + wrap cleanly — nothing spills outside the card.

### Overlays
- Notification dropdown and toasts are width-capped to the viewport.
- The map legend becomes a floating bottom pill on small screens.

---

## 11. Performance & Engineering Details

- **Code-splitting** — the heavy **Leaflet map** and **Recharts** chunks are
  loaded with `next/dynamic` (client-only) behind **branded skeletons**, so the
  shell and KPIs are interactive immediately.
- **Hydration-safe rendering** — the first paint mirrors seeded data + default
  filters to match the server; a `useHydrated` hook flips components to the live
  store post-mount, preventing hydration mismatches.
- **Stable Redux selectors** — selectors return stable references (not
  freshly-mapped arrays) to avoid needless re-renders under the 2-second tick.
- **Marker icon caching** — Leaflet marker icons are cached by `status|selected`
  so positions animate smoothly without rebuilding DOM each tick.
- **Branded loading & error states** — route-level loading skeleton, map tile
  loading/error gate with retry, and shimmer placeholders.
- **Motion & polish** — page entrance animations, a top navigation-progress bar,
  staggered sidebar reveals, and a global **`prefers-reduced-motion`** opt-out.
- **PWA & SEO** — web app manifest, custom favicon (`icon.svg`) and static
  apple-touch icon (`apple-icon.png`), plus OpenGraph/Twitter metadata.
- **Accessibility** — ARIA labels on icon buttons, `aria-current` on active nav,
  `aria-expanded`/`aria-haspopup` on menus, and reduced-motion support.
