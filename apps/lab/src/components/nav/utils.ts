import { NARROW_QUERY } from "./constants";

/** Nothing to subscribe to: the platform never changes during a session. */
export function subscribeNothing() {
  return () => {};
}

export function getShortcut() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? "\u2318 K" : "Ctrl K";
}

export function getShortcutOnServer() {
  return "Ctrl K";
}

export function subscribeNarrow(onChange: () => void) {
  const media = window.matchMedia(NARROW_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function getNarrow() {
  return window.matchMedia(NARROW_QUERY).matches;
}

export function getNarrowOnServer() {
  return false;
}
