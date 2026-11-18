"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import type { RollingDigitProps } from "./types";

export function RollingDigit({ digit, duration, className }: RollingDigitProps) {
  const reduceMotion = useReducedMotion();

  const hidden = reduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0, filter: "blur(2px)" };
  const shown = reduceMotion ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" };
  const exit = reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0, filter: "blur(2px)" };

  return (
    <span
      className={cn(
        "relative inline-flex h-[1.1em] items-center tabular-nums [clip-path:inset(-0.08em_-0.1em)]",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={hidden}
          animate={shown}
          exit={exit}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex h-full items-center leading-none"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
