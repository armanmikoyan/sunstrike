import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "./constants";
import type { ConsentChoice } from "./types";

export function isChoice(value: string | null): value is ConsentChoice {
  return value === "all" || value === "essential";
}

/** Reads the saved choice. Storage can throw in private modes, so guard it. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return isChoice(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
