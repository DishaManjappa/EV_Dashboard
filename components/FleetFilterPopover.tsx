"use client";

import { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import type { ChargingMode } from "@/lib/types";
import type { AdvancedFilters } from "@/store/slices/fleetSlice";

const chargingModes: ChargingMode[] = [
  "DC Fast Charging",
  "AC Charging",
  "Not Charging",
];

const labelSx = {
  color: "#6B6B5F",
  fontFamily: "var(--font-plex-sans), sans-serif",
  fontSize: "10.5px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
} as const;

export default function FleetFilterPopover({
  anchorEl,
  onClose,
  value,
  onApply,
  onReset,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  value: AdvancedFilters;
  onApply: (next: AdvancedFilters) => void;
  onReset: () => void;
}) {
  // local draft so toggling checkboxes / dragging the slider doesn't refilter
  // the table until the user commits with "Apply"
  const [draft, setDraft] = useState<AdvancedFilters>(value);

  // resync the draft with committed state whenever the popover (re)opens
  useEffect(() => {
    if (anchorEl) setDraft(value);
  }, [anchorEl, value]);

  const toggleMode = (mode: ChargingMode) => {
    setDraft((d) => ({
      ...d,
      chargingModes: d.chargingModes.includes(mode)
        ? d.chargingModes.filter((m) => m !== mode)
        : [...d.chargingModes, mode],
    }));
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: 280,
            p: 2.5,
            borderRadius: "16px",
            border: "1px solid #D8D0B8",
            bgcolor: "#FBF9F1",
            boxShadow: "0 12px 32px rgba(16,53,36,0.12)",
          },
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <div>
          <p style={labelSx} className="mb-2">
            Charging Mode
          </p>
          <div className="flex flex-col">
            {chargingModes.map((mode) => (
              <FormControlLabel
                key={mode}
                control={
                  <Checkbox
                    size="small"
                    checked={draft.chargingModes.includes(mode)}
                    onChange={() => toggleMode(mode)}
                    sx={{
                      color: "#B7C3A6",
                      p: "4px",
                      "&.Mui-checked": { color: "#103524" },
                    }}
                  />
                }
                label={mode}
                sx={{
                  m: 0,
                  "& .MuiFormControlLabel-label": {
                    fontFamily: "var(--font-plex-sans), sans-serif",
                    fontSize: "12.5px",
                    color: "#111",
                  },
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <p style={labelSx} className="mb-1">
            Battery {draft.minBattery}% – {draft.maxBattery}%
          </p>
          <div className="px-1.5">
            <Slider
              value={[draft.minBattery, draft.maxBattery]}
              onChange={(_, val) => {
                const [min, max] = val as number[];
                setDraft((d) => ({ ...d, minBattery: min, maxBattery: max }));
              }}
              min={0}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              sx={{
                color: "#103524",
                "& .MuiSlider-thumb": {
                  bgcolor: "#103524",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0 0 0 6px rgba(16,53,36,0.16)",
                  },
                },
                "& .MuiSlider-rail": { bgcolor: "#D8D0B8" },
                "& .MuiSlider-valueLabel": {
                  bgcolor: "#103524",
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: "10px",
                },
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            onClick={() => {
              onReset();
              setDraft({ chargingModes: [], minBattery: 0, maxBattery: 100 });
              onClose();
            }}
            sx={{
              textTransform: "none",
              fontFamily: "var(--font-plex-sans), sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#6B6B5F",
              "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
            }}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              bgcolor: "#103524",
              color: "#fff",
              fontFamily: "var(--font-plex-sans), sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              px: "18px",
              boxShadow: "none",
              "&:hover": { bgcolor: "#315A3E", boxShadow: "none" },
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </Popover>
  );
}
