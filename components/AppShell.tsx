"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NavigationProgress from "./NavigationProgress";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileNav } from "@/store/slices/uiSlice";

/**
 * Persistent application chrome. Rendered once in the root layout — *not* per
 * page — so the sidebar and header never unmount or replay their entrance
 * animations between navigations. Only the routed content inside <main> swaps,
 * which is what makes page changes feel instant instead of like a full reload.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mobileNavOpen = useAppSelector((s) => s.ui.mobileNavOpen);

  return (
    <div className="min-h-screen bg-ev-bg">
      <NavigationProgress />
      <Sidebar />

      {/* Backdrop behind the off-canvas nav drawer — mobile/tablet only. Tapping
          it (or anywhere outside the sidebar) dismisses the drawer. */}
      <div
        aria-hidden
        onClick={() => dispatch(setMobileNav(false))}
        className={`fixed inset-0 z-40 bg-ev-heading/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileNavOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div className="flex min-h-screen flex-col lg:ml-[228px]">
        <Header />
        {/* keyed by route so each page fades/rises in on arrival */}
        <main
          key={pathname}
          className="ev-page-in flex-1 px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
