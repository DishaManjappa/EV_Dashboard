import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Toast } from "@/lib/types";

interface UiState {
  sidebarCollapsed: boolean;
  live: boolean;
  // ids of alerts the operator has opened — the header bell counts the rest
  seenAlertIds: string[];
  toasts: Toast[];
}

const initialState: UiState = {
  sidebarCollapsed: false,
  live: true,
  seenAlertIds: [],
  toasts: [],
};

const MAX_TOASTS = 4;

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleLive(state) {
      state.live = !state.live;
    },
    setLive(state, action: PayloadAction<boolean>) {
      state.live = action.payload;
    },
    // mark an alert as opened/read → header bell count goes down
    acknowledgeAlert(state, action: PayloadAction<string>) {
      if (!state.seenAlertIds.includes(action.payload)) {
        state.seenAlertIds.push(action.payload);
      }
    },
    acknowledgeAlerts(state, action: PayloadAction<string[]>) {
      for (const id of action.payload) {
        if (!state.seenAlertIds.includes(id)) state.seenAlertIds.push(id);
      }
    },
    pushToast(state, action: PayloadAction<Toast>) {
      if (state.toasts.some((t) => t.id === action.payload.id)) return;
      state.toasts = [action.payload, ...state.toasts].slice(0, MAX_TOASTS);
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  toggleLive,
  setLive,
  acknowledgeAlert,
  acknowledgeAlerts,
  pushToast,
  dismissToast,
} = uiSlice.actions;
export default uiSlice.reducer;
