"use client";

import { useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { CODE_LENGTH } from "./constants";
import type { CodeInputProps } from "./types";

const POP: Transition = { type: "spring", stiffness: 460, damping: 28, mass: 0.7 };

const EMPTY_TONE = {
  borderColor: "rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.035)",
  boxShadow: "0 0 0 rgba(139, 92, 246, 0)",
};

const FILLED_TONE = {
  borderColor: "rgba(139, 92, 246, 0.6)",
  backgroundColor: "rgba(139, 92, 246, 0.13)",
  boxShadow: "0 0 18px rgba(139, 92, 246, 0.18)",
};

const FOCUSED_TONE = {
  borderColor: "rgba(255, 255, 255, 0.38)",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  boxShadow: "0 0 0 rgba(139, 92, 246, 0)",
};

const BUSY_TONE = {
  borderColor: "rgba(167, 139, 250, 0.85)",
  backgroundColor: "rgba(139, 92, 246, 0.2)",
  boxShadow: "0 0 22px rgba(139, 92, 246, 0.3)",
};

/**
 * Six single-digit boxes that behave like one field: typing advances, Backspace
 * retreats, the arrow keys move, and a pasted code fills from the focused box.
 * Each filled box lifts and glows; the last digit submits the form itself.
 */
export function CodeInput({ value, onChange, onComplete, labelledBy, disabled, busy }: CodeInputProps) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const digits = Array.from({ length: CODE_LENGTH }, (_, index) => value[index] ?? "");

  function focusBox(index: number) {
    const box = boxes.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))];

    box?.focus();
    box?.select();
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
        <motion.input
          key={index}
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
            event.currentTarget.select();
            setFocused(index);
          }}
          onBlur={() => setFocused(null)}
          animate={{
            scale: digit ? 1.06 : 1,
            y: digit ? -1 : 0,
            ...(busy ? BUSY_TONE : focused === index ? FOCUSED_TONE : digit ? FILLED_TONE : EMPTY_TONE),
          }}
          transition={reduceMotion ? { duration: 0 } : POP}
          className="h-11 w-full min-w-0 rounded-lg border text-center text-base font-medium text-foreground tabular-nums outline-none disabled:pointer-events-none disabled:opacity-50 lg:text-sm"
        />
      ))}
    </div>
  );
}
