import type { Transition } from "motion/react";
import { CODE_BOX_STAGGER_MS, CODE_ENTRANCE } from "./constants";

/**
 * Supabase reports the remaining wait only inside its own sentence
 * ("...you can only request this after 24 seconds."). Pull the number out so
 * the UI can show a countdown instead of the raw wording, and fall back to the
 * default window when the message has no number.
 */
export function cooldownSeconds(message: string, fallback = 60): number {
  const match = /after (\d+) seconds?/i.exec(message);

  if (!match) return fallback;

  return Math.min(Math.max(Number(match[1]), 1), 300);
}

/**
 * The project-wide hourly email cap, unlike the per-address window, does not
 * lift after a minute: a countdown would be a lie. Supabase words it "email
 * rate limit exceeded" (code `over_email_send_rate_limit`).
 */
export function isEmailQuotaError(message: string): boolean {
  return /email rate limit exceeded|over_email_send_rate_limit/i.test(message);
}

/**
 * The entrance ripple: each box waits one stagger longer than the one before
 * it. Reduced motion, or a step that is not on screen, lands instantly.
 */
export function entranceTransition(index: number, active: boolean, reduceMotion: boolean | null): Transition {
  if (reduceMotion || !active) return { duration: 0 };

  return { ...CODE_ENTRANCE, delay: (index * CODE_BOX_STAGGER_MS) / 1000 };
}

/** A violet ring that expands away as each box lands — a quiet ignition. */
export function flareTransition(index: number): Transition {
  return { duration: 0.6, ease: "easeOut", delay: (index * CODE_BOX_STAGGER_MS) / 1000 + 0.08 };
}

/**
 * A selected digit paints a grey block over the accent box, which reads as an
 * empty state. Keep the caret collapsed at the end instead: the glyph marks the
 * focus and typing over a digit still replaces it.
 */
export function collapseCaret(box: HTMLInputElement): void {
  box.setSelectionRange(box.value.length, box.value.length);
}
