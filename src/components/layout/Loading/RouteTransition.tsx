"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import LoadingScreen from "./LoadingScreen";

/** Wait a moment before showing the overlay so instant (prefetched) navs never flash. */
const SHOW_DELAY_MS = 120;
/** Keep the loader on screen long enough to be readable once it appears. */
const MIN_VISIBLE_MS = 420;
const FADE_OUT_MS = 300;
/** Never trap the user behind the overlay if a navigation fails or stalls. */
const SAFETY_TIMEOUT_MS = 12_000;

type Stage = "idle" | "pending" | "visible" | "leaving";

export default function RouteTransition() {
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");

  const stageRef = useRef<Stage>("idle");
  const visibleAtRef = useRef(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMountedRef = useRef(false);

  const moveTo = useCallback((next: Stage) => {
    stageRef.current = next;
    setStage(next);
  }, []);

  const finish = useCallback(() => {
    const current = stageRef.current;
    if (current !== "pending" && current !== "visible") return;

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    if (current === "pending") {
      moveTo("idle");
      return;
    }

    const remaining = Math.max(
      0,
      MIN_VISIBLE_MS - (performance.now() - visibleAtRef.current),
    );

    exitTimerRef.current = setTimeout(() => {
      moveTo("leaving");
      exitTimerRef.current = setTimeout(() => {
        moveTo("idle");
        exitTimerRef.current = null;
      }, FADE_OUT_MS);
    }, remaining);
  }, [moveTo]);

  const begin = useCallback(() => {
    if (stageRef.current === "pending" || stageRef.current === "visible") return;

    // A new navigation started while the previous overlay was fading out.
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    moveTo("pending");

    showTimerRef.current = setTimeout(() => {
      if (stageRef.current !== "pending") return;
      visibleAtRef.current = performance.now();
      moveTo("visible");
    }, SHOW_DELAY_MS);

    safetyTimerRef.current = setTimeout(finish, SAFETY_TIMEOUT_MS);
  }, [finish, moveTo]);

  // Start loading as soon as a same-origin page link is clicked.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.includes("external")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same path (hash or query-only links) does not trigger a page transition.
      if (url.pathname === window.location.pathname) return;

      begin();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [begin]);

  // Cover browser back/forward navigations too.
  useEffect(() => {
    const handlePopState = () => begin();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [begin]);

  // The new route has committed: fade the overlay out.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    finish();
  }, [pathname, finish]);

  // Lock scrolling only while the overlay is actually painted.
  useEffect(() => {
    if (stage !== "visible" && stage !== "leaving") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stage]);

  // Clear anything still scheduled if the app unmounts mid-transition.
  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  if (stage === "idle") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] transition-opacity duration-300 ease-out motion-reduce:transition-none",
        stage === "visible"
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <LoadingScreen variant="overlay" label="Loading page" />
    </div>
  );
}
