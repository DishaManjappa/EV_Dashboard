"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Top-of-viewport progress bar that fires the instant an internal link is
 * clicked and completes once the new route commits. App Router does soft client
 * navigation with no built-in pending signal, so without this the previous page
 * just sits there while the next one's chunk/render lands — which reads as
 * "stuck". The bar gives immediate optimistic feedback on every click.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTrickle = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
  };

  const start = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    stopTrickle();
    setVisible(true);
    setProgress(0.08);
    // ease toward ~90% with diminishing steps; the route commit finishes it
    trickle.current = setInterval(() => {
      setProgress((p) => (p >= 0.9 ? p : p + (0.9 - p) * 0.12));
    }, 180);
  };

  const complete = () => {
    stopTrickle();
    setProgress(1);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
  };

  // Begin on any qualifying internal-link click (captured before navigation).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // start() only reads stable setState/ref handles — safe to bind once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route committed → finish the bar.
  useEffect(() => {
    if (visible) complete();
    return stopTrickle;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .25s ease" }}
    >
      <div
        className="h-full origin-left rounded-r-full bg-ev-accent"
        style={{
          transform: `scaleX(${progress})`,
          transition: "transform .18s ease-out",
          boxShadow: "0 0 8px rgba(200,230,106,0.7), 0 0 2px rgba(200,230,106,0.9)",
        }}
      />
    </div>
  );
}
