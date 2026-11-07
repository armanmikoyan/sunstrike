"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import type { RollingDigitProps, RollingNumberProps } from "./types";

function RollingDigit({ digit, duration, className }: RollingDigitProps) {
  const reduceMotion = useReducedMotion();

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { y: "-100%", opacity: 0, filter: "blur(2px)" };
  const shown = reduceMotion
    ? { opacity: 1 }
    : { y: "0%", opacity: 1, filter: "blur(0px)" };
  const exit = reduceMotion
    ? { opacity: 0 }
    : { y: "100%", opacity: 0, filter: "blur(2px)" };

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

export function RollingNumber({
  value,
  decimalPlaces = 0,
  prefix,
  suffix,
  className,
  digitClassName,
  duration = 0.3,
}: RollingNumberProps) {
  const [integerPart, fractionalPart] = value
    .toFixed(decimalPlaces)
    .split(".");
  const integerDigits = integerPart.split("");

  return (
    <span className={cn("inline-flex items-center tabular-nums", className)}>
      {prefix ? <span>{prefix}</span> : null}
      {integerDigits.map((digit, index) => (
        <RollingDigit
          key={`integer-${integerDigits.length - 1 - index}`}
          digit={digit}
          duration={duration}
          className={digitClassName}
        />
      ))}
      {fractionalPart !== undefined ? (
        <>
          <span className="px-[0.02em]">.</span>
          {fractionalPart.split("").map((digit, index) => (
            <RollingDigit
              key={`fraction-${fractionalPart.length - 1 - index}`}
              digit={digit}
              duration={duration}
              className={digitClassName}
            />
          ))}
        </>
      ) : null}
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}
