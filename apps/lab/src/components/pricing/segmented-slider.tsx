"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";
import { useHaptics } from "@/hooks/use-haptics";
import { useSegmentedSlider } from "./hooks";
import type { SegmentedSliderProps } from "./types";

export function SegmentedSlider({
  value,
  min,
  max,
  step,
  onValueChange,
  label,
  ticks = 66,
  className,
}: SegmentedSliderProps) {
  const { trackRef, canvasRef, dragging, setDragging, setFromClientX, handleKeyDown, canvasStyle } = useSegmentedSlider(
    {
      value,
      min,
      max,
      step,
      onValueChange,
      ticks,
    },
  );
  const { pulse, tick } = useHaptics();
  const lastValue = useRef(value);

  // Tick once per value change during a drag, so the bar feels connected to the thumb.
  useEffect(() => {
    if (value === lastValue.current) return;
    lastValue.current = value;
    if (dragging) tick();
  }, [value, dragging, tick]);

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`$${value.toLocaleString("en-US")}`}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        pulse(6);
        setDragging(true);
        setFromClientX(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging) setFromClientX(event.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className={cn(
        "group relative cursor-pointer touch-none rounded-md py-0.5 select-none outline-white/35 focus-visible:outline-2 focus-visible:outline-offset-4",
        className,
      )}
    >
      <canvas ref={canvasRef} aria-hidden className="block" style={canvasStyle} />
    </div>
  );
}
