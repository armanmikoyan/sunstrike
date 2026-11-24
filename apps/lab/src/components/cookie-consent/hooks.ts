"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY, EXIT_DURATION, REDUCED_MOTION_QUERY } from "./constants";
import type { ConsentChoice } from "./types";
import { readConsent, subscribeConsent } from "./utils";

export function useCookieConsent() {
  const choice = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const ready = useSyncExternalStore(
    subscribeConsent,
    () => true,
    () => false,
  );
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const decide = useCallback((next: ConsentChoice) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { choice: next } }));
  }, []);

  const choose = useCallback(
    (next: ConsentChoice) => {
      if (leaving) return;
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
        decide(next);
        return;
      }
      setLeaving(true);
      timer.current = window.setTimeout(() => decide(next), EXIT_DURATION);
    },
    [decide, leaving],
  );

  return { choice, ready, decide, choose, leaving, open: ready && choice === null };
}
