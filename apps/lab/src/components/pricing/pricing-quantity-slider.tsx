"use client";

import { cn } from "cn";
import { Slider } from "@/ui/slider";
import { PERSPECTIVE, RADIUS, ROTATION_SPAN, SCALE_STYLES, TICK_COUNT, TICK_STEP } from "./constants";
import { useDrumDrag } from "./hooks";
import type { QuantitySliderProps } from "./types";

export function QuantitySlider({ value, min, max, onValueChange, ariaLabel, className }: QuantitySliderProps) {
  const { handlePointerDown, handlePointerMove, endDrag, clearDrag } = useDrumDrag({
    value,
    min,
    max,
    onValueChange,
  });

  const rotation = -((value - min) / (max - min)) * ROTATION_SPAN;

  return (
    <div
      onPointerDownCapture={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={clearDrag}
      style={{ perspective: `${PERSPECTIVE}px` }}
      className={cn(
        "group relative flex h-8 w-full cursor-grab touch-none select-none items-center overflow-hidden active:cursor-grabbing mask-[linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        style={{ transform: `rotateY(${rotation}deg)` }}
        className="absolute inset-0 transform-3d"
      >
        {Array.from({ length: TICK_COUNT }, (_, index) => {
          const angle = index * TICK_STEP;
          const facing = Math.cos(((angle + rotation) * Math.PI) / 180);
          const major = index % 8 === 0;

          return (
            <span
              key={index}
              style={{
                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                opacity: Math.max(0, facing),
              }}
              className={cn(
                "absolute left-1/2 top-1/2 -ml-px w-px rounded-full",
                major ? "-mt-2 h-4 bg-white/35" : "-mt-1.25 h-2.5 bg-white/20",
              )}
            />
          );
        })}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-4.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-brand-secondary/45"
      />

      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => onValueChange(next)}
        aria-label={ariaLabel}
        className={cn("relative z-10 w-full", SCALE_STYLES)}
      />
    </div>
  );
}
