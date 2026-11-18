"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "./constants";
import type { ConsentChoice } from "./types";
import { readConsent, subscribeConsent } from "./utils";

/**
 * The consent state behind the banner. The store reads storage directly, so
 * the markup matches on the server and the banner appears only once the
 * browser can answer. Both snapshots are primitives, which keeps their
 * identity stable between reads.
 */
export function useCookieConsent() {
  const choice = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const ready = useSyncExternalStore(
    subscribeConsent,
    () => true,
    () => false,
  );

  const decide = useCallback((next: ConsentChoice) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    } catch {
      // The choice still applies to this session when storage is blocked.
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { choice: next } }));
  }, []);

  return { choice, ready, decide, open: ready && choice === null };
}
