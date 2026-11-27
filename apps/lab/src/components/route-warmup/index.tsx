"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePrefetch } from "@/hooks/use-prefetch";
import { WARM_FALLBACK_MS, WARM_ROUTES, WARM_TIMEOUT_MS } from "./constants";

export function RouteWarmup() {
  const pathname = usePathname();
  const prefetch = usePrefetch();
  const warmed = useRef(new Set<string>());

  useEffect(() => {
    const routes = WARM_ROUTES.filter((route) => route !== pathname && !warmed.current.has(route));
    if (routes.length === 0) return;

    let idle: number | null = null;
    let timeout: number | null = null;

    const run = () => {
      for (const route of routes) {
        warmed.current.add(route);
        prefetch(route);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(run, { timeout: WARM_TIMEOUT_MS });
    } else {
      timeout = window.setTimeout(run, WARM_FALLBACK_MS);
    }

    return () => {
      if (idle !== null) window.cancelIdleCallback(idle);
      if (timeout !== null) window.clearTimeout(timeout);
    };
  }, [pathname, prefetch]);

  return null;
}
