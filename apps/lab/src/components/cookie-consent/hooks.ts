"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  consentEvent,
  consentStorageKey,
  type ConsentChoice,
} from "./constants";

function isChoice(value: string | null): value is ConsentChoice {
  return value === "all" || value === "essential";
}

/** Reads the saved choice. Storage can throw in private modes, so guard it. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(consentStorageKey);
    return isChoice(saved) ? saved : null;
  } catch {
    return null;
  }
}

type ConsentState = {
  choice: ConsentChoice | null;
  ready: boolean;
};

/** The server and the hydration pass have no storage to read yet. */
const serverState: ConsentState = { choice: null, ready: false };

let cachedChoice: ConsentChoice | null | undefined;
let cachedState: ConsentState = serverState;

/**
 * Snapshots must keep their identity between reads, so the choice is cached
 * until the stored value actually changes.
 */
function getState(): ConsentState {
  const choice = readConsent();
  if (choice !== cachedChoice) {
    cachedChoice = choice;
    cachedState = { choice, ready: true };
  }
  return cachedState;
}

function subscribe(onChange: () => void) {
  window.addEventListener(consentEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(consentEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The consent state behind the banner. The store reads storage directly, so
 * the markup matches on the server and the banner appears only once the
 * browser can answer.
 */
export function useCookieConsent() {
  const { choice, ready } = useSyncExternalStore(
    subscribe,
    getState,
    () => serverState,
  );

  const decide = useCallback((next: ConsentChoice) => {
    try {
      window.localStorage.setItem(consentStorageKey, next);
    } catch {
      // The choice still applies to this session when storage is blocked.
    }
    window.dispatchEvent(
      new CustomEvent(consentEvent, { detail: { choice: next } }),
    );
  }, []);

  return { choice, ready, decide, open: ready && choice === null };
}
