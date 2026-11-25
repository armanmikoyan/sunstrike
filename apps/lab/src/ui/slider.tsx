"use client";

import * as React from "react";
import { cn } from "cn";
import { Slider as SliderPrimitive } from "radix-ui";

const THUMB_HALF_PX = 6;

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Announced instead of the raw number, such as "6 seconds". */
  valueText?: string;
  /** Draws a mark at every step between `min` and `max`. */
  marks?: boolean;
};

/** Matches Radix's thumb placement, which insets the thumb at both ends of the track. */
function markOffset(percent: number): string {
  return `calc(${percent}% + ${THUMB_HALF_PX - (THUMB_HALF_PX * percent) / 50}px)`;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  valueText,
  marks = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );
  const markCount = marks && max > min ? Math.floor((max - min) / step) + 1 : 0;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-white/10 data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: markCount }, (_, index) => (
        <span
          key={index}
          aria-hidden
          data-slot="slider-mark"
          className="pointer-events-none absolute top-1/2 size-1 -translate-1/2 rounded-full bg-white/35"
          style={{ left: markOffset((index / (markCount - 1)) * 100) }}
        />
      ))}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={valueText}
          key={index}
          className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
