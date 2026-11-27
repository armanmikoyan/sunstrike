"use client";

import { useEffect } from "react";
import { useStore } from "jotai";
import { OFFERINGS_IDLE_FALLBACK_MS, OFFERINGS_IDLE_TIMEOUT_MS } from "./constants";
import { warmOfferings } from "./hooks";
import { offeringsAtom } from "./state";

/**
 * Loads the shared model catalog while the browser is idle and seeds the atom,
 * so the first screen that needs it renders content instead of a skeleton.
 */
export function OfferingsWarmup() {
  const store = useStore();

  useEffect(() => {
    let idle: number | null = null;
    let timer: number | null = null;

    const run = async () => {
      const next = await warmOfferings();
      if (next.status === "ready" && store.get(offeringsAtom).status === "loading") {
        store.set(offeringsAtom, next);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(run, { timeout: OFFERINGS_IDLE_TIMEOUT_MS });
    } else {
      timer = window.setTimeout(run, OFFERINGS_IDLE_FALLBACK_MS);
    }

    return () => {
      if (idle !== null) window.cancelIdleCallback(idle);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [store]);

  return null;
}
