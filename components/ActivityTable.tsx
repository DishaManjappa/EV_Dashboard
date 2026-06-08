"use client";

import Link from "next/link";
import { ArrowUpRight, Battery } from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectVehicle } from "@/store/slices/fleetSlice";
import { carImageFor } from "@/lib/carImages";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";

const headSx = {
  color: "#6B6B5F",
  fontFamily: "var(--font-plex-sans), sans-serif",
  fontSize: "10.5px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  borderBottom: "1px solid rgba(216,208,184,0.5)",
  py: "10px",
} as const;

const cellSx = {
  color: "#111",
  fontFamily: "var(--font-plex-sans), sans-serif",
  fontSize: "12.5px",
  borderBottom: "1px solid rgba(216,208,184,0.5)",
  py: "11px",
} as const;

export default function ActivityTable() {
  const vehicles = useAppSelector((s) => s.fleet.vehicles).slice(0, 5);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const open = (id: string) => {
    dispatch(selectVehicle(id));
    router.push("/fleet");
  };

  return (
    <div className="rounded-2xl border border-ev-border bg-ev-card shadow-card">
      <div className="flex items-center justify-between border-b border-ev-border/70 px-5 py-4">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-ev-heading">
            Recent Fleet Activity
          </h3>
          <p className="text-[11.5px] text-ev-mutedText">
            Latest status updates · click a row to inspect
          </p>
        </div>
        <Link
          href="/fleet"
          className="inline-flex items-center gap-1 rounded-full border border-ev-border bg-white/40 px-3 py-1.5 text-[11.5px] font-medium text-ev-heading transition-colors hover:bg-white"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <TableContainer sx={{ maxWidth: "100%" }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              {["Vehicle ID", "Driver", "Status", "Battery", "Range", "Location"].map(
                (h) => (
                  <TableCell key={h} sx={{ ...headSx, pl: h === "Vehicle ID" ? "20px" : undefined }}>
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow
                key={v.id}
                hover
                onClick={() => open(v.id)}
                sx={{ cursor: "pointer", "&:hover": { bgcolor: "rgba(255,255,255,0.45)" } }}
              >
                <TableCell sx={{ ...cellSx, pl: "20px", fontWeight: 600, color: "#103524" }}>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={carImageFor(v.id)}
                      alt={v.model}
                      className="h-8 w-8 shrink-0 rounded-lg object-cover"
                    />
                    {v.id}
                  </div>
                </TableCell>
                <TableCell sx={cellSx}>{v.driver}</TableCell>
                <TableCell sx={cellSx}>
                  <StatusBadge status={v.status} />
                </TableCell>
                <TableCell sx={cellSx}>
                  <div className="flex items-center gap-2">
                    <Battery
                      className={`h-3.5 w-3.5 ${
                        v.battery < 25
                          ? "text-ev-red"
                          : v.battery < 50
                            ? "text-ev-yellow"
                            : "text-ev-primary"
                      }`}
                    />
                    <div className="max-w-[80px] flex-1">
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
                    <span className="text-[12px] font-medium text-ev-heading tabular-nums">
                      {v.battery}%
                    </span>
                  </div>
                </TableCell>
                <TableCell sx={cellSx}>{v.range} km</TableCell>
                <TableCell sx={{ ...cellSx, color: "#6B6B5F" }}>{v.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
