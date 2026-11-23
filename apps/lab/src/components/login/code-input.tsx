"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "cn";
import { CODE_BOX_STAGGER_MS, CODE_LENGTH } from "./constants";
import type { CodeInputProps } from "./types";

/**
 * A box arrives from below with a soft spring: enough travel to read as
 * motion, enough damping to settle without wobbling. The stagger turns the six
 * into a left-to-right ripple instead of one block fading in.
 */
const ENTRANCE: Transition = { type: "spring", stiffness: 240, damping: 22, mass: 0.9 };

/** Digit and state changes: quick, with a hint of overshoot. */
const DIGIT: Transition = { type: "spring", stiffness: 460, damping: 28, mass: 0.7 };

/** Each box waits a little longer than the one before it, then springs in. */
const HIDDEN_BOX = { opacity: 0, y: 16, scale: 0.84 };
const SHOWN_BOX = { opacity: 1, y: 0, scale: 1 };

function entrance(index: number, active: boolean, reduceMotion: boolean | null): Transition {
  if (reduceMotion || !active) return { duration: 0 };

  return { ...ENTRANCE, delay: (index * CODE_BOX_STAGGER_MS) / 1000 };
}

/** A violet ring that expands away as each box lands — a quiet ignition. */
function flare(index: number): Transition {
  return { duration: 0.6, ease: "easeOut", delay: (index * CODE_BOX_STAGGER_MS) / 1000 + 0.08 };
}

const EMPTY_TONE = {
  borderColor: "rgba(167, 139, 250, 0.24)",
  backgroundColor: "rgba(139, 92, 246, 0.06)",
  boxShadow: "0 0 0 rgba(139, 92, 246, 0)",
};

const FILLED_TONE = {
  borderColor: "rgba(139, 92, 246, 0.6)",
  backgroundColor: "rgba(139, 92, 246, 0.13)",
  boxShadow: "0 0 18px rgba(139, 92, 246, 0.18)",
};

const FOCUSED_TONE = {
  borderColor: "rgba(196, 181, 253, 0.85)",
  backgroundColor: "rgba(139, 92, 246, 0.12)",
  boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.18)",
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
export function CodeInput({
  value,
  onChange,
  onComplete,
  labelledBy,
  disabled,
  busy,
  active = true,
  refocus,
}: CodeInputProps) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
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

  function focusBox(index: number) {
    const box = boxes.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))];

    if (!box) return;

    box.focus();
    collapseCaret(box);
  }

  /**
   * A selected digit paints a grey block over the accent box, which reads as
   * an empty state. Keep the caret collapsed at the end instead: the glyph
   * marks the focus and typing over a digit still replaces it.
   */
  function collapseCaret(box: HTMLInputElement) {
    box.setSelectionRange(box.value.length, box.value.length);
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
          initial={HIDDEN_BOX}
          animate={active ? SHOWN_BOX : HIDDEN_BOX}
          transition={entrance(index, active, reduceMotion)}
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
              ...(busy ? BUSY_TONE : focused === index ? FOCUSED_TONE : digit ? FILLED_TONE : EMPTY_TONE),
            }}
            transition={reduceMotion ? { duration: 0 } : DIGIT}
            className="aspect-square w-full min-w-0 rounded-lg border text-center text-base font-normal text-foreground caret-transparent tabular-nums outline-none disabled:pointer-events-none disabled:opacity-50 lg:text-base"
          />
          {active && !reduceMotion ? (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0.7, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.12 }}
              transition={flare(index)}
              className="pointer-events-none absolute inset-0 rounded-lg border border-brand-secondary/70"
            />
          ) : null}
          {focused === index ? (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-xl leading-none text-brand-secondary",
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
