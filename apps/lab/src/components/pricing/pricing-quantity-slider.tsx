"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Slider } from "@/ui/slider";
import { cn } from "cn";
import { PERSPECTIVE, RADIUS, ROTATION_SPAN, SCALE_STYLES, TICK_COUNT, TICK_STEP } from "./constants";
import type { QuantitySliderProps, SliderDrag } from "./types";

/**
 * A 3D drum of ticks that loops around a cylinder. The caret stays fixed at
 * the centre while the drum rotates under it; dragging the surface moves it
 * 1:1 with the pointer, so pulling right uncovers lower values from the left.
 */
export function QuantitySlider({ value, min, max, onValueChange, ariaLabel, className }: QuantitySliderProps) {
  const dragRef = useRef<SliderDrag | null>(null);

  const progress = (value - min) / (max - min);
  const rotation = -progress * ROTATION_SPAN;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;

    const root = event.currentTarget;
    const slider = root.querySelector<HTMLElement>('[role="slider"]');

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startValue: value,
      travel: Math.max(1, root.getBoundingClientRect().width),
    };

    root.setPointerCapture(event.pointerId);
    slider?.focus({ preventScroll: true });

    event.preventDefault();
    event.stopPropagation();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const delta = event.clientX - drag.startX;
    const next = Math.round(drag.startValue - (delta / drag.travel) * (max - min));

    onValueChange(Math.min(max, Math.max(min, next)));
    event.preventDefault();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      onPointerDownCapture={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => {
        dragRef.current = null;
      }}
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
