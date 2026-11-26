"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "cn";
import type { StudioDurationSliderProps } from "./types";
import { durationIndex, formatDuration, formatDurationRange, spokenDuration } from "./utils";

/**
 * A notch strip rather than a web slider: every allowed duration is a tick and
 * the chosen one is a tall brand-coloured tick. Drag anywhere on the strip,
 * click a notch, or use the arrow keys; there is no filled progress track.
 */
export function StudioDurationSlider({ options, value, onValueChange, label, className }: StudioDurationSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const index = durationIndex(options, value);
  const multiple = options.length > 1;

  function selectAt(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();

    if (!rect || rect.width === 0) return;

    const fraction = (clientX - rect.left) / rect.width;
    const next = Math.min(options.length - 1, Math.max(0, Math.round(fraction * (options.length - 1))));
    const seconds = options[next];

    if (seconds !== undefined && seconds !== value) onValueChange(seconds);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!multiple || event.button !== 0) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerId.current = event.pointerId;
    setDragging(true);
    selectAt(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (pointerId.current === event.pointerId) selectAt(event.clientX);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== event.pointerId) return;

    selectAt(event.clientX);
    pointerId.current = null;
    setDragging(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!multiple) return;

    const steps: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowUp: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      Home: 0,
      End: options.length - 1,
      PageUp: options.length - 1,
      PageDown: 0,
    };
    const target = steps[event.key];

    if (target === undefined) return;

    event.preventDefault();

    const seconds = options[Math.min(options.length - 1, Math.max(0, target))];

    if (seconds !== undefined) onValueChange(seconds);
  }

  return (
    <div className={className}>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={multiple ? 0 : -1}
        aria-label={label}
        aria-valuemin={options[0]}
        aria-valuemax={options.at(-1)}
        aria-valuenow={value}
        aria-valuetext={spokenDuration(value)}
        aria-disabled={multiple ? undefined : true}
        data-disabled={multiple ? undefined : ""}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerId.current = null;
          setDragging(false);
        }}
        className={cn(
          "flex h-6 touch-none items-center justify-between rounded-md px-0.5 select-none [-webkit-tap-highlight-color:transparent]",
          multiple
            ? "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
            : "opacity-50",
          multiple && (dragging ? "cursor-grabbing" : "cursor-grab"),
        )}
      >
        {options.map((seconds, optionIndex) => {
          const selected = optionIndex === index;

          return (
            <span key={seconds} className="flex h-6 w-2 items-center justify-center">
              <span
                aria-hidden
                className={cn("h-3 w-0.5 rounded-full", selected ? "bg-brand-secondary" : "bg-white/20")}
              />
            </span>
          );
        })}
      </div>
      <div className="mt-0.5 flex items-center justify-between font-mono text-[0.6875rem] text-muted-foreground lg:text-[0.625rem]">
        <span>{formatDurationRange(options)}</span>
        <span className="text-foreground">{formatDuration(value)}</span>
      </div>
    </div>
  );
}
