"use client";

import Chip from "@mui/material/Chip";
import type { VehicleStatus } from "@/lib/types";

const tone: Record<
  VehicleStatus,
  { bg: string; fg: string; border: string }
> = {
  Active: { bg: "rgba(220,229,200,0.6)", fg: "#315A3E", border: "rgba(49,90,62,0.2)" },
  Idle: { bg: "rgba(168,168,160,0.15)", fg: "#6B6B5F", border: "rgba(168,168,160,0.35)" },
  Charging: { bg: "#F5E5B8", fg: "#B98A1E", border: "rgba(214,165,52,0.35)" },
  Alert: { bg: "#F4D6CE", fg: "#B64432", border: "rgba(182,68,50,0.3)" },
  "En Route": { bg: "rgba(220,229,200,0.4)", fg: "#5E7A55", border: "rgba(127,155,116,0.35)" },
};

export default function StatusBadge({ status }: { status: VehicleStatus }) {
  const t = tone[status];
  return (
    <Chip
      size="small"
      label={status}
      sx={{
        maxWidth: "none",
        height: 22,
        borderRadius: "999px",
        bgcolor: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        fontFamily: "var(--font-plex-sans), sans-serif",
        fontSize: "11px",
        fontWeight: 500,
        "& .MuiChip-label": { px: "9px", overflow: "visible" },
      }}
    />
  );
}
