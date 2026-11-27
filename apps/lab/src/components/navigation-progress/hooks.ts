"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FADE_MS,
  HOLD_MS,
  MAX_PROGRESS_MS,
  NAVIGATION_SETTLED_EVENT,
  NAVIGATION_START_EVENT,
  SHOW_DELAY_MS,
  START_PROGRESS,
  TRICKLE_MS,
} from "./constants";

export function useNavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const firstPath = useRef(true);
  const running = useRef(false);
  const lastRoute = useRef<string | null>(null);
  const show = useRef<number | null>(null);
  const trickle = useRef<number | null>(null);
  const safety = useRef<number | null>(null);
  const hide = useRef<number | null>(null);
  const reset = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (!running.current) return;
    running.current = false;

    if (trickle.current !== null) {
      window.clearInterval(trickle.current);
      trickle.current = null;
    }
    if (safety.current !== null) {
      window.clearTimeout(safety.current);
      safety.current = null;
    }
    if (reset.current !== null) {
      window.clearTimeout(reset.current);
      reset.current = null;
    }

    // The route settled before the bar appeared: never flash it.
    if (show.current !== null) {
      window.clearTimeout(show.current);
      show.current = null;
      setProgress(0);
      return;
    }

    setProgress(100);
    hide.current = window.setTimeout(() => {
      setVisible(false);
      reset.current = window.setTimeout(() => setProgress(0), FADE_MS);
    }, HOLD_MS + FADE_MS);
  }, []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;

    if (hide.current !== null) {
      window.clearTimeout(hide.current);
      hide.current = null;
    }
    if (reset.current !== null) {
      window.clearTimeout(reset.current);
      reset.current = null;
    }

    setProgress(START_PROGRESS);
    show.current = window.setTimeout(() => {
      show.current = null;
      if (!running.current) return;

      setVisible(true);
      trickle.current = window.setInterval(() => {
        setProgress((value) => Math.min(90, value + Math.max(1, (90 - value) * 0.08)));
      }, TRICKLE_MS);
    }, SHOW_DELAY_MS);
    safety.current = window.setTimeout(finish, MAX_PROGRESS_MS);
  }, [finish]);

  useEffect(() => {
    const route = `${pathname}${window.location.search}`;

    if (firstPath.current) {
      firstPath.current = false;
      lastRoute.current = route;
      return;
    }

    lastRoute.current = route;
    finish();
  }, [pathname, finish]);

  // Links report through `useLinkStatus` (see `@/components/link`), and
  // `router.push` callers dispatch the start event themselves. Back/forward
  // has no link, so popstate starts the bar and the pathname commit ends it.
  useEffect(() => {
    const onPopState = () => {
      const route = `${window.location.pathname}${window.location.search}`;
      if (route === lastRoute.current) return;

      const samePath = lastRoute.current?.split("?")[0] === window.location.pathname;
      lastRoute.current = route;
      // A query-only step never changes the pathname, so nothing would end it.
      if (samePath) return;

      start();
    };
    const onStart = () => start();

    window.addEventListener("popstate", onPopState);
    window.addEventListener(NAVIGATION_START_EVENT, onStart);
    window.addEventListener(NAVIGATION_SETTLED_EVENT, finish);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener(NAVIGATION_START_EVENT, onStart);
      window.removeEventListener(NAVIGATION_SETTLED_EVENT, finish);
    };
  }, [start, finish]);

  useEffect(() => {
    return () => {
      if (show.current !== null) window.clearTimeout(show.current);
      if (trickle.current !== null) window.clearInterval(trickle.current);
      if (safety.current !== null) window.clearTimeout(safety.current);
      if (hide.current !== null) window.clearTimeout(hide.current);
      if (reset.current !== null) window.clearTimeout(reset.current);
    };
  }, []);

  return { visible, progress };
}
