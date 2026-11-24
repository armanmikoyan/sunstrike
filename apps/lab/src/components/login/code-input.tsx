"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
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
import type { CodeInputProps } from "./types";
import { collapseCaret, entranceTransition, flareTransition } from "./utils";

/**
 * Six single-digit boxes that behave like one field: typing advances, Backspace
 * retreats, the arrow keys move, and a pasted code fills from the focused box.
 * Each filled box lifts and glows; the last digit submits the form itself.
 */
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
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const handledRestart = useRef(restart ?? 0);
  const [focused, setFocused] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const digits = Array.from({ length: CODE_LENGTH }, (_, index) => value[index] ?? "");

  // Landing on the code step should not make the user click a box first: the
  // first box takes the caret (and opens the keypad on mobile).
  useEffect(() => {
    if (!active) return;

    focusBox(0);
  }, [active]);

  // A rejected code keeps its digits on purpose: park the caret on the last
  // box so Backspace starts trimming right away.
  useEffect(() => {
    if (!refocus) return;

    focusBox(CODE_LENGTH - 1);
  }, [refocus]);

  // A fresh code arrives empty, so the caret belongs on the first box again.
  // The boxes are disabled while the resend is in flight, and a disabled input
  // cannot take focus, so wait for them to come back before moving it.
  useEffect(() => {
    const next = restart ?? 0;

    if (next === handledRestart.current) return;
    if (disabled) return;

    handledRestart.current = next;
    focusBox(0);
  }, [restart, disabled]);

  function focusBox(index: number) {
    const box = boxes.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))];

    if (!box) return;

    box.focus();
    collapseCaret(box);
  }

  function commit(next: string, focusIndex: number) {
    onChange(next);

    // The sixth digit is the submit gesture: no button to hunt for.
    if (next.length === CODE_LENGTH) onComplete?.(next);

    focusBox(focusIndex);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const entered = event.target.value.replace(/\D/g, "");

    if (!entered) return;

    // The code is stored densely, so a box past the end appends rather than
    // leaving gaps — typing always fills the next empty slot.
    const at = Math.min(index, value.length);

    commit(
      (value.slice(0, at) + entered + value.slice(at + entered.length)).slice(0, CODE_LENGTH),
      at + entered.length,
    );
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    // A full box refuses the insert before `onChange` can replace it, so a
    // collapsed caret on a filled box would swallow the keystroke.
    if (/^\d$/.test(event.key) && digits[index]) {
      event.preventDefault();
      commit(value.slice(0, index) + event.key + value.slice(index + 1), index + 1);

      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      if (digits[index]) {
        commit(value.slice(0, index) + value.slice(index + 1), index);
      } else {
        commit(value.slice(0, -1), index - 1);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const entered = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!entered) return;

    event.preventDefault();

    const at = Math.min(index, value.length);
    const room = CODE_LENGTH - at;

    commit((value.slice(0, at) + entered.slice(0, room) + value.slice(at)).slice(0, CODE_LENGTH), at + room);
  }

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
