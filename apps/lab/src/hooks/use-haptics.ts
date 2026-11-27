"use client";

import { useCallback, useRef } from "react";

/** Minimum gap between drag ticks, so a fast drag does not turn into a buzz. */
const TICK_INTERVAL_MS = 45;

/**
 * Short haptic pulses for touch interactions. The Vibration API only exists on
 * mobile, so this is a silent no-op on desktop and unsupported browsers.
 */
export function useHaptics() {
  const lastTick = useRef(Number.NEGATIVE_INFINITY);

  const pulse = useCallback((pattern: number | number[] = 8) => {
    try {
      navigator.vibrate?.(pattern);
    } catch {}
  }, []);

  /** A lighter, rate-limited pulse for continuous gestures such as a drag. */
  const tick = useCallback(() => {
    const now = performance.now();
    if (now - lastTick.current < TICK_INTERVAL_MS) return;
    lastTick.current = now;
    pulse(3);
  }, [pulse]);

  return { pulse, tick };
}
