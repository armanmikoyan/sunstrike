"use client";

import { useReducedMotion } from "motion/react";
import type { GenerationMode } from "@/components/studio/types";
import { PROMPT_IDEAS } from "./constants";
import { useOnScreen, useTypingCycle } from "./hooks";

/**
 * Owns the typing cycle so each tick re-renders this hint, not the composer
 * form around it. Reduced motion gets one static idea; an off-screen hint or
 * hidden tab freezes it.
 */
export function ComposerTypingHint({ mode }: { mode: GenerationMode }) {
  const reduceMotion = useReducedMotion();
  const { ref, onScreen } = useOnScreen<HTMLSpanElement>();
  const text = useTypingCycle(PROMPT_IDEAS[mode], { enabled: !reduceMotion, paused: !onScreen });

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-3 top-2 text-sm lg:text-[0.8125rem] leading-relaxed text-muted-foreground/80"
    >
      {text}
      <span className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.12em] bg-muted-foreground/60 motion-safe:animate-pulse" />
    </span>
  );
}
