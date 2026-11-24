import type { Transition } from "motion/react";
import { CODE_BOX_STAGGER_MS, CODE_ENTRANCE } from "./constants";

export function cooldownSeconds(message: string, fallback = 60): number {
  const match = /after (\d+) seconds?/i.exec(message);

  if (!match) return fallback;

  return Math.min(Math.max(Number(match[1]), 1), 300);
}

export function isEmailQuotaError(message: string): boolean {
  return /email rate limit exceeded|over_email_send_rate_limit/i.test(message);
}

export function entranceTransition(index: number, active: boolean, reduceMotion: boolean | null): Transition {
  if (reduceMotion || !active) return { duration: 0 };

  return { ...CODE_ENTRANCE, delay: (index * CODE_BOX_STAGGER_MS) / 1000 };
}

export function flareTransition(index: number): Transition {
  return { duration: 0.6, ease: "easeOut", delay: (index * CODE_BOX_STAGGER_MS) / 1000 + 0.08 };
}

export function collapseCaret(box: HTMLInputElement): void {
  box.setSelectionRange(box.value.length, box.value.length);
}
