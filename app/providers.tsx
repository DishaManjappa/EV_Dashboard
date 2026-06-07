"use client";

import { Provider } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { store } from "@/store";
import FleetStream from "@/components/FleetStream";
import ToastContainer from "@/components/ToastContainer";

// MUI theme tuned to the EVOLT dark-green control-room palette. We keep the
// surface dark and let the lime accent carry interactive state so MUI controls
// blend into the bespoke header instead of looking like stock Material.
const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#C8E66A" },
    background: { paper: "#142210", default: "#142210" },
    text: { primary: "#F3EEDC", secondary: "rgba(243,238,220,0.6)" },
  },
  shape: { borderRadius: 999 },
  typography: {
    fontFamily: "var(--font-plex-sans), system-ui, sans-serif",
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={muiTheme}>
        <Provider store={store}>
          <FleetStream />
          {children}
          <ToastContainer />
        </Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
