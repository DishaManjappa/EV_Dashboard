"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectVehicle, defaultAdvancedFilters } from "@/store/slices/fleetSlice";
import { vehicles as seedVehicles } from "@/lib/data";
import { carImageFor } from "@/lib/carImages";
import { useHydrated } from "@/lib/useHydrated";
import type { Vehicle } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const chargingColor: Record<string, string> = {
  "DC Fast Charging": "text-ev-yellow",
  "AC Charging": "text-ev-yellow",
  "Not Charging": "text-ev-mutedText",
};

type SortKey = "id" | "model" | "driver" | "status" | "battery" | "range";

const columns: {
  key: SortKey | "charging" | "location" | "updated";
  label: string;
  sortable: boolean;
  numeric?: boolean;
  width: string;
}[] = [
  { key: "id", label: "Vehicle ID", sortable: true, width: "12%" },
  { key: "model", label: "EV Model", sortable: true, width: "13%" },
  { key: "driver", label: "Driver/User", sortable: true, width: "12%" },
  { key: "status", label: "Status", sortable: true, width: "11%" },
  { key: "battery", label: "Battery %", sortable: true, numeric: true, width: "12%" },
  { key: "range", label: "Range", sortable: true, numeric: true, width: "7%" },
  { key: "charging", label: "Charging", sortable: false, width: "11%" },
  { key: "location", label: "Location", sortable: false, width: "12%" },
  { key: "updated", label: "Last Updated", sortable: false, width: "10%" },
];

const headSx = {
  color: "#6B6B5F",
  fontFamily: "var(--font-plex-sans), sans-serif",
  fontSize: "10.5px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid rgba(216,208,184,0.7)",
  bgcolor: "rgba(220,229,200,0.3)",
  py: "10px",
  px: "12px",
  lineHeight: 1.25,
  verticalAlign: "bottom",
  "& .MuiTableSortLabel-root": { color: "#6B6B5F !important" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#103524 !important" },
  "& .MuiTableSortLabel-icon": { color: "#315A3E !important" },
} as const;

const cellSx = {
  color: "#111",
  fontFamily: "var(--font-plex-sans), sans-serif",
  fontSize: "12.5px",
  borderBottom: "1px solid rgba(216,208,184,0.5)",
  py: "12px",
  px: "12px",
} as const;

// clean single-line truncation for free-text columns so the table never has to
// scroll sideways — the full value stays available via the cell's title tooltip
const truncSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: 0,
} as const;

export default function FleetTable() {
  const dispatch = useAppDispatch();
  const live = useAppSelector((s) => s.fleet);
  const hydrated = useHydrated();

  // Until mounted, mirror the server render (seed data + default filters) so
  // hydration matches; afterwards switch to the live, simulated store.
  const vehicles = hydrated ? live.vehicles : seedVehicles;
  const statusFilter = hydrated ? live.statusFilter : "All";
  const searchQuery = hydrated ? live.searchQuery : "";
  const advancedFilters = hydrated ? live.advancedFilters : defaultAdvancedFilters;
  const selectedVehicleId = live.selectedVehicleId;

  const [orderBy, setOrderBy] = useState<SortKey>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // reset to first page whenever the result set changes underneath us
  useEffect(() => setPage(0), [statusFilter, searchQuery, advancedFilters, rowsPerPage]);

  const filtered = useMemo(() => {
    const { chargingModes, minBattery, maxBattery } = advancedFilters;
    return vehicles.filter((v) => {
      if (statusFilter !== "All" && v.status !== statusFilter) return false;
      if (v.battery < minBattery || v.battery > maxBattery) return false;
      if (chargingModes.length > 0 && !chargingModes.includes(v.chargingMode)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          v.id.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vehicles, statusFilter, searchQuery, advancedFilters]);

  const sorted = useMemo(() => {
    const dir = order === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[orderBy as keyof Vehicle];
      const bv = b[orderBy as keyof Vehicle];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, orderBy, order]);

  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const sort = (key: SortKey) => {
    if (orderBy === key) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ev-border bg-ev-card shadow-card">
      <TableContainer>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  sortDirection={orderBy === c.key ? order : false}
                  sx={{ ...headSx, width: c.width }}
                >
                  {c.sortable ? (
                    <TableSortLabel
                      active={orderBy === c.key}
                      direction={orderBy === c.key ? order : "asc"}
                      onClick={() => sort(c.key as SortKey)}
                    >
                      {c.label}
                    </TableSortLabel>
                  ) : (
                    c.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <TableRow
                  key={v.id}
                  hover
                  selected={isSelected}
                  onClick={() => dispatch(selectVehicle(v.id))}
                  sx={{
                    cursor: "pointer",
                    "&.Mui-selected, &.Mui-selected:hover": {
                      bgcolor: "rgba(220,229,200,0.45)",
                    },
                    "&:hover": { bgcolor: "rgba(255,255,255,0.45)" },
                  }}
                >
                  <TableCell sx={cellSx}>
                    <div className="flex items-center gap-2">
                      <img
                        src={carImageFor(v.id)}
                        alt={v.model}
                        className={`h-8 w-8 shrink-0 rounded-lg object-cover ${
                          isSelected ? "ring-2 ring-ev-heading" : ""
                        }`}
                      />
                      <span className="truncate font-medium text-ev-heading">{v.id}</span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, ...truncSx }} title={v.model}>
                    {v.model}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, ...truncSx }} title={v.driver}>
                    {v.driver}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <StatusBadge status={v.status} />
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <div className="flex items-center gap-2">
                      <div className="max-w-[70px] flex-1">
                        <div className="h-1.5 w-full rounded-full bg-ev-border/60">
                          <div
                            className={`h-full rounded-full ${
                              v.battery < 25
                                ? "bg-ev-red"
                                : v.battery < 50
                                  ? "bg-ev-yellow"
                                  : "bg-ev-primary"
                            }`}
                            style={{ width: `${v.battery}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-medium text-ev-heading tabular-nums">
                        {v.battery}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, whiteSpace: "nowrap" }}>{v.range} km</TableCell>
                  <TableCell
                    sx={{ ...cellSx, ...truncSx, fontSize: "11.5px" }}
                    title={v.chargingMode}
                  >
                    <span className={chargingColor[v.chargingMode]}>{v.chargingMode}</span>
                  </TableCell>
                  <TableCell
                    sx={{ ...cellSx, ...truncSx, color: "#6B6B5F" }}
                    title={v.location}
                  >
                    {v.location}
                  </TableCell>
                  <TableCell sx={{ ...cellSx, color: "#6B6B5F", whiteSpace: "nowrap" }}>
                    {v.lastUpdated}
                  </TableCell>
                </TableRow>
              );
            })}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ ...cellSx, textAlign: "center", py: "48px", color: "#6B6B5F" }}>
                  No vehicles match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Rows"
        sx={{
          borderTop: "1px solid rgba(216,208,184,0.7)",
          color: "#6B6B5F",
          fontFamily: "var(--font-plex-sans), sans-serif",
          fontSize: "11.5px",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "11.5px",
            color: "#6B6B5F",
          },
          "& .MuiTablePagination-select": { color: "#103524" },
          "& .MuiSvgIcon-root": { color: "#6B6B5F" },
          "& .MuiIconButton-root.Mui-disabled": { color: "rgba(107,107,95,0.3)" },
        }}
      />
    </div>
  );
}
