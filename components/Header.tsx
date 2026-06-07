"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import GridViewRounded from "@mui/icons-material/GridViewRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import SyncRounded from "@mui/icons-material/SyncRounded";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import { useAppSelector, useAppDispatch } from "@/store";
import { toggleLive } from "@/store/slices/uiSlice";
import NotificationBell from "./NotificationBell";

const REGION = "US-WEST-2";

// Maps the active route to its breadcrumb label so the header always mirrors
// the sidebar nav the user came from.
const SECTIONS: Record<string, string> = {
  "/overview": "Overview",
  "/fleet": "Fleet",
  "/drivers": "Drivers",
  "/charging": "Charging",
  "/alerts": "Alerts",
  "/reports": "Reports",
  "/settings": "Settings",
};

// Shared pill styling so every MUI control reads as part of the bespoke
// dark-green header rather than stock Material.
const chipSx = {
  height: 30,
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  bgcolor: "rgba(255,255,255,0.04)",
  color: "#F3EEDC",
  fontFamily: "var(--font-plex-mono), monospace",
  fontSize: "10.5px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  transition: "background-color .2s, border-color .2s",
  "& .MuiChip-label": { px: "9px", display: "flex", alignItems: "center", gap: "5px" },
  "& .MuiChip-icon": { ml: "10px", mr: "-4px", fontSize: 14, color: "rgba(243,238,220,0.55)" },
} as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const live = useAppSelector((s) => s.ui.live);
  const dispatch = useAppDispatch();

  const [dateStr, setDateStr] = useState("—");
  const [timeStr, setTimeStr] = useState("--:-- --");
  const [syncStr, setSyncStr] = useState("--:--:--");
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  const section =
    Object.entries(SECTIONS).find(([href]) => pathname?.startsWith(href))?.[1] ??
    "Overview";

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setDateStr(
        d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
      setTimeStr(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setSyncStr(
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-ev-sidebar font-sans text-ev-sidebarText">
      {/* Soft seam at the sidebar / header junction — a short vertical line that
          fades downward, so it's present without being a full separator. */}
      <div className="pointer-events-none absolute left-0 top-0 h-16 w-px bg-gradient-to-b from-white/[0.18] via-white/[0.06] to-transparent" />

      <div className="relative flex h-16 items-center gap-6 px-8">
        {/* Breadcrumb trail mirroring the sidebar nav */}
        <Breadcrumbs
          separator={<ChevronRightRounded sx={{ fontSize: 16 }} />}
          aria-label="breadcrumb"
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: "rgba(243,238,220,0.28)",
              mx: 0.5,
            },
          }}
        >
          <MuiLink
            component={Link}
            href="/overview"
            underline="none"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              color: "rgba(243,238,220,0.6)",
              fontFamily: "var(--font-plex-sans), sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              transition: "color .2s",
              "&:hover": { color: "#DCE5C8" },
            }}
          >
            <GridViewRounded sx={{ fontSize: 16, color: "#C8E66A" }} />
            EV Dashboard
          </MuiLink>
          <Typography
            sx={{
              color: "#F3EEDC",
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "14.5px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            {section}
          </Typography>
        </Breadcrumbs>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3.5">
          {/* Live / Pause stream toggle */}
          <Tooltip
            title={live ? "Pause live data stream" : "Resume live data stream"}
            arrow
          >
            <Chip
              clickable
              onClick={() => dispatch(toggleLive())}
              icon={
                <Box
                  component="span"
                  sx={{ position: "relative", display: "flex", width: 7, height: 7 }}
                >
                  {live && (
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "999px",
                        bgcolor: "#C8E66A",
                        opacity: 0.7,
                        animation: "evPing 1.2s cubic-bezier(0,0,0.2,1) infinite",
                        "@keyframes evPing": {
                          "75%, 100%": { transform: "scale(2.2)", opacity: 0 },
                        },
                      }}
                    />
                  )}
                  <Box
                    component="span"
                    sx={{
                      position: "relative",
                      width: 7,
                      height: 7,
                      borderRadius: "999px",
                      bgcolor: live ? "#C8E66A" : "rgba(243,238,220,0.4)",
                    }}
                  />
                </Box>
              }
              label={live ? "Live" : "Paused"}
              sx={{
                ...chipSx,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                border: live
                  ? "1px solid rgba(200,230,106,0.3)"
                  : "1px solid rgba(255,255,255,0.1)",
                bgcolor: live ? "rgba(200,230,106,0.12)" : "rgba(255,255,255,0.04)",
                color: live ? "#C8E66A" : "rgba(243,238,220,0.55)",
                "& .MuiChip-icon": { ml: "11px", mr: "-3px" },
                "&:hover": {
                  bgcolor: live
                    ? "rgba(200,230,106,0.18)"
                    : "rgba(255,255,255,0.08)",
                },
              }}
            />
          </Tooltip>

          {/* Region / location */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Tooltip title="Active service region" arrow>
              <Chip
                icon={<LocationOnRounded />}
                label={<span style={{ color: "#F3EEDC", fontWeight: 700 }}>{REGION}</span>}
                sx={chipSx}
              />
            </Tooltip>
          </Box>

          {/* Last sync */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Tooltip title={`Last synced at ${syncStr}`} arrow>
              <Chip
                icon={
                  <SyncRounded
                    sx={{
                      animation: live ? "evSpin 3.5s linear infinite" : "none",
                      "@keyframes evSpin": { to: { transform: "rotate(360deg)" } },
                    }}
                  />
                }
                label={
                  <>
                    <span style={{ color: "rgba(243,238,220,0.55)" }}>SYNCED</span>
                    <span style={{ color: "rgba(243,238,220,0.9)", letterSpacing: "0.04em" }}>
                      {syncStr}
                    </span>
                  </>
                }
                sx={chipSx}
              />
            </Tooltip>
          </Box>

          <Box
            aria-hidden
            sx={{
              display: { xs: "none", md: "block" },
              width: "1px",
              height: 28,
              bgcolor: "rgba(255,255,255,0.1)",
            }}
          />

          {/* Date · Time */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Chip
              icon={<CalendarTodayRounded sx={{ fontSize: "13px !important" }} />}
              label={
                <>
                  <span
                    style={{
                      color: "#F3EEDC",
                      fontFamily: "var(--font-plex-sans), sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0",
                      fontSize: "12px",
                    }}
                  >
                    {dateStr}
                  </span>
                  <span
                    style={{
                      color: "rgba(243,238,220,0.65)",
                      fontVariantNumeric: "tabular-nums",
                      fontSize: "12px",
                    }}
                  >
                    {timeStr}
                  </span>
                </>
              }
              sx={{
                ...chipSx,
                height: 32,
                "& .MuiChip-icon": {
                  ml: "11px",
                  mr: "-3px",
                  fontSize: 13,
                  color: "#C8E66A",
                },
                "& .MuiChip-label": {
                  px: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                },
              }}
            />
          </Box>

          {/* Notifications */}
          <NotificationBell />

          {/* User */}
          <ButtonBase
            onClick={(e) => setUserAnchor(e.currentTarget)}
            aria-haspopup="true"
            aria-expanded={Boolean(userAnchor)}
            sx={{
              gap: "8px",
              pl: "4px",
              pr: "8px",
              py: "4px",
              borderRadius: "999px",
              transition: "background-color .2s",
              "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontFamily: "var(--font-sora), sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #38583D 0%, #315A3E 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              A
            </Avatar>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  color: "#F3EEDC",
                  fontFamily: "var(--font-plex-sans), sans-serif",
                  fontSize: "12.5px",
                  fontWeight: 600,
                }}
              >
                Admin
              </span>
              <span
                style={{
                  color: "rgba(243,238,220,0.45)",
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: "9.5px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Fleet Ops
              </span>
            </Box>
            <KeyboardArrowDownRounded
              sx={{
                fontSize: 18,
                color: "rgba(243,238,220,0.55)",
                transition: "transform .2s",
                transform: userAnchor ? "rotate(180deg)" : "none",
              }}
            />
          </ButtonBase>

          <Menu
            anchorEl={userAnchor}
            open={Boolean(userAnchor)}
            onClose={() => setUserAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: "16px",
                  bgcolor: "#F8F5E8",
                  color: "#111",
                  border: "1px solid #D8D0B8",
                  boxShadow: "0 10px 30px rgba(16,53,36,0.18)",
                  overflow: "hidden",
                  "& .MuiMenuItem-root": {
                    fontFamily: "var(--font-plex-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#103524",
                    py: "9px",
                    "&:hover": { bgcolor: "rgba(49,90,62,0.08)" },
                  },
                  "& .MuiListItemIcon-root": { color: "#315A3E", minWidth: 30 },
                },
              },
            }}
          >
            <Box sx={{ px: "16px", pt: "12px", pb: "10px" }}>
              <div style={{ fontFamily: "var(--font-sora), sans-serif", fontSize: 13.5, fontWeight: 700, color: "#103524" }}>
                Admin
              </div>
              <div style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10.5, color: "#6B6B5F", marginTop: 2 }}>
                admin@evfleet.io
              </div>
            </Box>
            <Box sx={{ height: "1px", bgcolor: "#D8D0B8", mx: "12px", mb: "4px" }} />
            <MenuItem onClick={() => setUserAnchor(null)}>
              <ListItemIcon>
                <PersonOutlineRounded sx={{ fontSize: 18 }} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setUserAnchor(null);
                router.push("/settings");
              }}
            >
              <ListItemIcon>
                <SettingsRounded sx={{ fontSize: 18 }} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Box sx={{ height: "1px", bgcolor: "#D8D0B8", mx: "12px", my: "4px" }} />
            <MenuItem onClick={() => setUserAnchor(null)} sx={{ color: "#B64432 !important" }}>
              <ListItemIcon>
                <LogoutRounded sx={{ fontSize: 18, color: "#B64432 !important" }} />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}
