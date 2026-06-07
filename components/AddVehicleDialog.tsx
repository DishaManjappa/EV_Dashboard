"use client";

import { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { addVehicle } from "@/store/slices/fleetSlice";
import type { Vehicle, VehicleStatus, ChargingMode } from "@/lib/types";

const statuses: VehicleStatus[] = ["Active", "Idle", "Charging", "En Route", "Alert"];
const chargingModes: ChargingMode[] = [
  "Not Charging",
  "DC Fast Charging",
  "AC Charging",
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "rgba(255,255,255,0.5)",
    fontFamily: "var(--font-plex-sans), sans-serif",
    fontSize: "13px",
    color: "#111",
    "& fieldset": { borderColor: "#D8D0B8" },
    "&:hover fieldset": { borderColor: "#B7C3A6" },
    "&.Mui-focused fieldset": { borderColor: "#315A3E", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "var(--font-plex-sans), sans-serif",
    fontSize: "13px",
    color: "#6B6B5F",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#315A3E" },
} as const;

const emptyForm = {
  id: "",
  model: "",
  driver: "",
  status: "Idle" as VehicleStatus,
  battery: 80,
  chargingMode: "Not Charging" as ChargingMode,
  location: "",
};

export default function AddVehicleDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  // select the stable array reference, then derive ids — selecting `.map(...)`
  // directly returns a new array each render and crashes useSyncExternalStore
  const allVehicles = useAppSelector((s) => s.fleet.vehicles);
  const existingIds = useMemo(
    () => new Set(allVehicles.map((v) => v.id)),
    [allVehicles],
  );
  const [form, setForm] = useState(emptyForm);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const trimmedId = form.id.trim();
  const duplicateId = existingIds.has(trimmedId);
  const valid =
    trimmedId !== "" &&
    !duplicateId &&
    form.model.trim() !== "" &&
    form.driver.trim() !== "";

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    if (!valid) return;
    const battery = Math.max(0, Math.min(100, Math.round(form.battery)));
    const vehicle: Vehicle = {
      id: trimmedId,
      model: form.model.trim(),
      driver: form.driver.trim(),
      status: form.status,
      battery,
      range: Math.round(battery * 4), // ~4 km per battery %, matches seed efficiency
      chargingMode: form.chargingMode,
      location: form.location.trim() || "Unknown",
      lastUpdated: "Just now",
      coords: [37.3875, -122.0575], // Bay Area default
    };
    dispatch(addVehicle(vehicle));
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: 420,
            maxWidth: "90vw",
            borderRadius: "16px",
            border: "1px solid #D8D0B8",
            bgcolor: "#FBF9F1",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#103524",
          pb: 1,
        }}
      >
        Add Vehicle
      </DialogTitle>
      <DialogContent>
        <div className="mt-1 flex flex-col gap-3.5">
          <TextField
            label="Vehicle ID"
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            error={duplicateId}
            helperText={duplicateId ? "This ID already exists" : " "}
            placeholder="EV-128"
            size="small"
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="EV Model"
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="Tesla Model 3"
            size="small"
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Driver / User"
            value={form.driver}
            onChange={(e) => set("driver", e.target.value)}
            placeholder="Jane Doe"
            size="small"
            fullWidth
            sx={fieldSx}
          />
          <div className="flex gap-3">
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as VehicleStatus)}
              size="small"
              fullWidth
              sx={fieldSx}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: "13px" }}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Battery %"
              type="number"
              value={form.battery}
              onChange={(e) => set("battery", Number(e.target.value))}
              size="small"
              fullWidth
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              sx={fieldSx}
            />
          </div>
          <TextField
            select
            label="Charging Mode"
            value={form.chargingMode}
            onChange={(e) => set("chargingMode", e.target.value as ChargingMode)}
            size="small"
            fullWidth
            sx={fieldSx}
          >
            {chargingModes.map((m) => (
              <MenuItem key={m} value={m} sx={{ fontSize: "13px" }}>
                {m}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Fremont, CA"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontFamily: "var(--font-plex-sans), sans-serif",
            fontSize: "12.5px",
            fontWeight: 500,
            color: "#6B6B5F",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!valid}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            bgcolor: "#103524",
            color: "#fff",
            fontFamily: "var(--font-plex-sans), sans-serif",
            fontSize: "12.5px",
            fontWeight: 500,
            px: "18px",
            boxShadow: "none",
            "&:hover": { bgcolor: "#315A3E", boxShadow: "none" },
            "&.Mui-disabled": { bgcolor: "rgba(16,53,36,0.25)", color: "#fff" },
          }}
        >
          Add Vehicle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
