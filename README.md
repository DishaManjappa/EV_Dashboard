# EV Fleet & System Dashboard

A real-time control room for electric-vehicle fleet operations — live vehicle
tracking, battery & charging telemetry, an interactive map, alerting, and energy
analytics, all in a clean, automotive-inspired interface.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Redux Toolkit**,
**MUI**, **Tailwind CSS**, **Recharts**, and **React-Leaflet**.


### Prerequisites

- **Node.js 18.17+** (or 20+ )
- **npm** (ships with Node)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser. The dashboard boots with
seeded fleet data and immediately begins streaming live (simulated) telemetry.

> **Note on the project path:** Next.js's bundled `@vercel/og` icon generator has
> a Windows bug with spaces in the absolute path, so the app icon is shipped as a
> static asset (`app/apple-icon.png`) rather than rendered on the fly. No action
> needed — this is already handled.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server (hot reload) |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Architecture Overview

The app is a **client-rendered single-page experience inside the Next.js App
Router**. A persistent shell (sidebar + header) is mounted once in the root
layout, and only the routed page content swaps on navigation — so the chrome
never unmounts and page changes feel instant.

### Project structure

```
app/                 # App Router routes (Overview, Fleet, Charging, Alerts, Reports, …)
  layout.tsx         # Root layout: fonts, metadata, providers, app shell
  providers.tsx      # Redux store + MUI theme + live data stream + toasts
  page.tsx           # Dashboard Overview
  fleet/ charging/ alerts/ reports/ drivers/ settings/   # Pages
components/          # All UI: shell, tables, charts, map, panels, dialogs, toasts
store/
  index.ts           # configureStore + typed hooks
  slices/
    fleetSlice.ts    # Fleet domain state (vehicles, stations, alerts, filters, selection)
    uiSlice.ts       # UI state (live toggle, mobile nav, seen alerts, toasts)
lib/
  data.ts            # Seed fleet data
  types.ts           # Shared domain types
  simulator.ts       # Pure function that advances the fleet one "tick"
  mockSocket.ts      # setInterval-based stream mimicking a socket lifecycle
  alerts.ts          # Alert derivation helpers
  carImages.ts       # Deterministic vehicle imagery
  useHydrated.ts     # Hydration-safe mounting hook
```

### State management

State is centralized in **Redux Toolkit**, split into two slices:

- **`fleetSlice`** — the domain model: `vehicles`, `stations`, `summary`,
  `powerSeries`, `batteryDistribution`, `alerts`, plus view state like the
  selected vehicle/station, search query, status filter, and advanced filters.
- **`uiSlice`** — presentation state: the Live/Pause toggle, the mobile-nav
  drawer, acknowledged ("seen") alert ids for the notification badge, and the
  active toast queue.

Components read state with a typed `useAppSelector` and dispatch with
`useAppDispatch`. Selectors are kept granular (selecting stable references, not
freshly-mapped arrays) to avoid unnecessary re-renders.

### Real-time data flow

The "live" behaviour is a **self-contained simulation** modelled on a socket
lifecycle (per the spec — no backend required):

```
mockSocket (setInterval, 2s)
      │  pulls current snapshot
      ▼
simulator.simulateTick()   ← pure, deterministic state advance
      │  returns next snapshot
      ▼
FleetStream component  → dispatch(applyTick)  → fleetSlice updates
      │
      └─ new alerts → dispatch(pushToast)     → ToastContainer
```

`FleetStream` is mounted once in `providers.tsx`, gated by `ui.live`, and renders
nothing — it simply bridges the stream into Redux. The whole UI (KPI cards,
charts, map markers, tables, badges) reactively reflects each tick.

### Styling & rendering choices

- **Tailwind CSS** for layout, spacing, and the bespoke dark-green/cream theme
  (custom palette + fonts defined in `tailwind.config.ts`); **MUI** for complex
  interactive primitives (tables, dialogs, sliders, popovers, menus) themed to
  blend into the brand rather than look like stock Material.
- **Recharts** powers the analytics (battery donut, power-consumption area
  chart, charging gauge); **React-Leaflet** powers the live fleet map.
- Heavy chunks (map + charts) are **code-split** via `next/dynamic` with branded
  loading skeletons, so the shell is interactive before they stream in.
- Rendering is **hydration-safe**: the first paint mirrors seeded data and
  default filters, then switches to the live store post-mount (`useHydrated`).
- **Fully responsive** down to mobile: the fixed sidebar collapses into an
  off-canvas drawer (hamburger + tap-to-dismiss backdrop), grids reflow, and
  wide tables become horizontally scrollable within their cards.

---

## Future Roadmap 

  - Data-fetching layer (RTK Query / React Query — caching, optimistic updates, reconnection)
  - Performance at scale (table/list virtualization, memoized selectors, bundle audit, lazy-loading)
  - Theming & personalization (light/dark, density, persisted preferences)
  - Richer data visualization (drill-downs, brush/zoom, client-side CSV/PDF export)
  - Map UX enhancements (clustering, geofences, route playback, smooth transitions)
  - Real-time polish (animated value transitions, in-place updates, change highlights)
  - Flesh out Drivers & Settings UIs

## Links:
  ## [Prototype Link](https://www.figma.com/proto/JZ2UsHGsuhAb6PDRaI3muc/Next-Gen-Electric-Vehicle--EV--Management-Dashboard?node-id=2-3&p=f&t=MEa4WIjVhC4IynYT-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A3)

## [Design Link](https://www.figma.com/design/JZ2UsHGsuhAb6PDRaI3muc/Next-Gen-Electric-Vehicle--EV--Management-Dashboard?node-id=148-44&t=m6h3EYQTNtJkEQAI-1)

## [Deployed Application Link (Vercel)](https://ev-dashboard-steel.vercel.app/)

