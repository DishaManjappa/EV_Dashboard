"use client";

import { useState } from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSearchQuery,
  setStatusFilter,
  setAdvancedFilters,
  resetAdvancedFilters,
  defaultAdvancedFilters,
} from "@/store/slices/fleetSlice";
import { vehicles as seedVehicles } from "@/lib/data";
import { useHydrated } from "@/lib/useHydrated";
import type { VehicleStatus } from "@/lib/types";
import FleetFilterPopover from "./FleetFilterPopover";
import AddVehicleDialog from "./AddVehicleDialog";

const filters: ("All" | VehicleStatus)[] = [
  "All",
  "Idle",
  "Charging",
  "En Route",
  "Alert",
];

export default function FleetToolbar() {
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter, vehicles: liveVehicles, advancedFilters } =
    useAppSelector((s) => s.fleet);
  const hydrated = useHydrated();

  // seed counts match the server render until live ticks take over post-mount
  const vehicles = hydrated ? liveVehicles : seedVehicles;

  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // count how many advanced filters are diverging from the defaults
  const activeAdvancedCount =
    (advancedFilters.chargingModes.length > 0 ? 1 : 0) +
    (advancedFilters.minBattery !== defaultAdvancedFilters.minBattery ||
    advancedFilters.maxBattery !== defaultAdvancedFilters.maxBattery
      ? 1
      : 0);

  const counts = filters.reduce<Record<string, number>>((acc, f) => {
    acc[f] =
      f === "All" ? vehicles.length : vehicles.filter((v) => v.status === f).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ev-border bg-ev-card p-3 shadow-card">
      <TextField
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        placeholder="Search by vehicle ID or driver name"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search className="h-4 w-4 text-ev-mutedText" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          minWidth: { xs: "100%", sm: 260 },
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "999px",
            bgcolor: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-plex-sans), sans-serif",
            fontSize: "13px",
            color: "#111",
            "& fieldset": { borderColor: "#D8D0B8" },
            "&:hover fieldset": { borderColor: "#B7C3A6" },
            "&.Mui-focused fieldset": { borderColor: "#315A3E", borderWidth: 2 },
          },
          "& .MuiInputBase-input::placeholder": { color: "#6B6B5F", opacity: 1 },
        }}
      />

      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={(_, val) => val && dispatch(setStatusFilter(val))}
        sx={{
          flexWrap: "wrap",
          gap: "6px",
          "& .MuiToggleButtonGroup-grouped": {
            border: "1px solid #D8D0B8 !important",
            borderRadius: "999px !important",
            mx: 0,
          },
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontFamily: "var(--font-plex-sans), sans-serif",
            fontSize: "11.5px",
            fontWeight: 500,
            color: "#6B6B5F",
            bgcolor: "rgba(255,255,255,0.4)",
            px: "12px",
            py: "5px",
            gap: "6px",
            "&:hover": { bgcolor: "#fff" },
            "&.Mui-selected": {
              color: "#fff",
              bgcolor: "#103524",
              borderColor: "#103524 !important",
              "&:hover": { bgcolor: "#1a4a30" },
            },
          },
        }}
      >
        {filters.map((f) => (
          <ToggleButton key={f} value={f} disableRipple>
            {f}
            <Badge
              badgeContent={counts[f]}
              max={999}
              sx={{
                "& .MuiBadge-badge": {
                  position: "static",
                  transform: "none",
                  bgcolor: statusFilter === f ? "rgba(255,255,255,0.18)" : "rgba(216,208,184,0.5)",
                  color: statusFilter === f ? "#fff" : "#6B6B5F",
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: "10px",
                  height: 16,
                  minWidth: 16,
                  borderRadius: "999px",
                },
              }}
            />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Badge
        color="primary"
        badgeContent={activeAdvancedCount}
        sx={{
          "& .MuiBadge-badge": {
            bgcolor: "#103524",
            color: "#fff",
            fontFamily: "var(--font-plex-mono), monospace",
            fontSize: "10px",
            minWidth: 16,
            height: 16,
          },
        }}
      >
        <Button
          startIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            border: activeAdvancedCount > 0 ? "1px solid #103524" : "1px solid #D8D0B8",
            bgcolor: activeAdvancedCount > 0 ? "rgba(16,53,36,0.06)" : "rgba(255,255,255,0.4)",
            color: activeAdvancedCount > 0 ? "#103524" : "#6B6B5F",
            fontFamily: "var(--font-plex-sans), sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            px: "14px",
            "&:hover": { bgcolor: "#fff", borderColor: "#B7C3A6" },
          }}
        >
          Filters
        </Button>
      </Badge>

      <FleetFilterPopover
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        value={advancedFilters}
        onApply={(next) => dispatch(setAdvancedFilters(next))}
        onReset={() => dispatch(resetAdvancedFilters())}
      />

      <Button
        startIcon={<Plus className="h-3.5 w-3.5" />}
        onClick={() => setAddOpen(true)}
        sx={{
          textTransform: "none",
          borderRadius: "999px",
          bgcolor: "#103524",
          color: "#fff",
          fontFamily: "var(--font-plex-sans), sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          px: "16px",
          boxShadow: "none",
          "&:hover": { bgcolor: "#315A3E", boxShadow: "none" },
        }}
        variant="contained"
      >
        Add Vehicle
      </Button>

      <AddVehicleDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
