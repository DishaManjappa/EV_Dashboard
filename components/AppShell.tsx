"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NavigationProgress from "./NavigationProgress";

/**
 * Persistent application chrome. Rendered once in the root layout — *not* per
 * page — so the sidebar and header never unmount or replay their entrance
 * animations between navigations. Only the routed content inside <main> swaps,
 * which is what makes page changes feel instant instead of like a full reload.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ev-bg">
      <NavigationProgress />
      <Sidebar />
      <div className="ml-[228px] flex min-h-screen flex-col">
        <Header />
        {/* keyed by route so each page fades/rises in on arrival */}
        <main key={pathname} className="ev-page-in flex-1 px-8 pb-10 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
