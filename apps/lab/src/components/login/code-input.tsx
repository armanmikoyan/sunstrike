"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import {
  CODE_BOX_HIDDEN,
  CODE_BOX_SHOWN,
  CODE_BUSY_TONE,
  CODE_DIGIT,
  CODE_EMPTY_TONE,
  CODE_FILLED_TONE,
  CODE_FOCUSED_TONE,
  CODE_LENGTH,
} from "./constants";
import { useCodeInput } from "./hooks";
import type { CodeInputProps } from "./types";
import { collapseCaret, entranceTransition, flareTransition } from "./utils";

export function CodeInput({
  value,
  onChange,
  onComplete,
  labelledBy,
  disabled,
  busy,
  active = true,
  refocus,
  restart,
}: CodeInputProps) {
  const reduceMotion = useReducedMotion();
  const { boxes, digits, focused, setFocused, handleChange, handleKeyDown, handlePaste } = useCodeInput({
    value,
    onChange,
    onComplete,
    disabled,
    active,
    refocus,
    restart,
  });

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-busy={busy}
      className="mt-1.5 grid grid-cols-6 gap-1.5 lg:gap-2"
    >
      {digits.map((digit, index) => (
        <motion.div
          key={index}
          initial={CODE_BOX_HIDDEN}
          animate={active ? CODE_BOX_SHOWN : CODE_BOX_HIDDEN}
          transition={entranceTransition(index, active, reduceMotion)}
          className="relative"
        >
          <motion.input
            ref={(element) => {
              boxes.current[index] = element;
            }}
            type="text"
            value={digit}
            maxLength={1}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
            disabled={disabled}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => {
              collapseCaret(event.currentTarget);
              setFocused(index);
            }}
            onBlur={() => setFocused(null)}
            initial={false}
            animate={{
              scale: digit ? 1.06 : 1,
              y: digit ? -1 : 0,
              ...(busy
                ? CODE_BUSY_TONE
                : focused === index
                  ? CODE_FOCUSED_TONE
                  : digit
                    ? CODE_FILLED_TONE
                    : CODE_EMPTY_TONE),
            }}
            transition={reduceMotion ? { duration: 0 } : CODE_DIGIT}
            className="aspect-square w-full min-w-0 rounded-lg border text-center text-base font-normal text-foreground caret-transparent tabular-nums outline-none disabled:pointer-events-none disabled:opacity-50 lg:text-base"
          />
          {active && !reduceMotion ? (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0.7, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.12 }}
              transition={flareTransition(index)}
              className="pointer-events-none absolute inset-0 rounded-lg border border-brand-secondary/70"
            />
          ) : null}
          {focused === index ? (
            <span
              aria-hidden="true"
              className={cn(
                "caret-blink pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-xl leading-none text-brand-secondary",
                digit ? "left-1/2 translate-x-2" : "left-1/2 -translate-x-1/2",
              )}
            >
              |
            </span>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
