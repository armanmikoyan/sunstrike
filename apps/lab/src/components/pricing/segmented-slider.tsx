"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SegmentedSliderProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  label: string;
  /** Upper bound on how many ticks the strip may draw. */
  ticks?: number;
  className?: string;
};

const TICK_HEIGHT = 16;
const TICK_WIDTH = 3;
const TICK_RADIUS = 4;
const PITCH = 11;
const FILL_MS = 150;
/** Taller than the resting tick so the swell has room to grow both ways. */
const BOX_HEIGHT = 24;
const POP_MS = 260;
const POP_SCALE = 1.45;

const FILLED = [167, 139, 250] as const;
const EMPTY = [255, 255, 255] as const;
const EMPTY_ALPHA = 0.2;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const easeOut = (t: number) => 1 - (1 - t) ** 3;

type TickLayout = {
  width: number;
  ratio: number;
  /** Sub-pixel part of the track's device offset, nudged back to a whole pixel. */
  snap: number;
};

/**
 * A slider drawn as a row of thin bars that spans the whole track, modelled on
 * the Higgsfield pricing bar: every tick is 3×16px with a 4px radius, all the
 * same size, and only its colour changes as the amount passes it.
 *
 * A tick that changes state swells from its middle and settles back, so every
 * tick rests at the same size.
 *
 * The ticks are painted to a canvas at device resolution. A CSS-width tick lands
 * on 4 or 5 device pixels depending on where it falls once the display uses a
 * fractional ratio (110%/125% zoom, scaled MacBooks), which is what made some
 * ticks look fatter than their neighbours. Canvas rects are exact device pixels,
 * so every tick is identical everywhere.
 */
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
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levelsRef = useRef<number[]>([]);
  const startRef = useRef<number[]>([]);
  const fromRef = useRef<number[]>([]);
  const targetsRef = useRef<number[]>([]);
  const popsRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [layout, setLayout] = useState<TickLayout>({
    width: 0,
    ratio: 1,
    snap: 0,
  });

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const offset = (rect.left * ratio) % 1;

      setLayout({
        width: Math.round(rect.width),
        ratio,
        snap: ((offset + 1) % 1) / ratio,
      });
    };

    measure();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const toFraction = useCallback(
    (amount: number) =>
      Math.log(clamp(amount, min, max) / min) / Math.log(max / min),
    [min, max],
  );

  const fromFraction = useCallback(
    (fraction: number) => {
      const raw = min * (max / min) ** clamp(fraction, 0, 1);
      return clamp(Math.round(raw / step) * step, min, max);
    },
    [min, max, step],
  );

  const setFromClientX = (clientX: number) => {
    const element = trackRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    onValueChange(fromFraction((clientX - rect.left) / rect.width));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const jump = Math.max(step, Math.round((max - min) / 20 / step) * step);
    const next: Record<string, number> = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      PageUp: value + jump,
      PageDown: value - jump,
      Home: min,
      End: max,
    };

    if (!(event.key in next)) return;
    event.preventDefault();
    onValueChange(clamp(next[event.key], min, max));
  };

  const { width, ratio, snap } = layout;
  const deviceWidth = Math.round(width * ratio);
  const tickDevice = Math.max(2, Math.round(TICK_WIDTH * ratio));
  const restHeightDevice = Math.max(2, Math.round(TICK_HEIGHT * ratio));
  const heightDevice = Math.max(
    restHeightDevice,
    Math.round(BOX_HEIGHT * ratio),
  );
  const radiusDevice = Math.max(1, Math.round(TICK_RADIUS * ratio));
  const count = width ? clamp(Math.round(width / PITCH) + 1, 16, ticks) : 0;

  // Whole device pixels: the leftover pixels are spread one at a time across
  // the gaps so the strip still ends exactly on the right edge.
  const gapCount = Math.max(1, count - 1);
  const baseGap = Math.floor((deviceWidth - tickDevice) / gapCount);
  const extraGaps = deviceWidth - tickDevice - baseGap * gapCount;

  const endIndex = Math.round(toFraction(value) * (count - 1));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || count < 2 || baseGap <= tickDevice) return;

    canvas.width = deviceWidth;
    canvas.height = heightDevice;

    const levels = levelsRef.current;
    const starts = startRef.current;
    const from = fromRef.current;
    const targets = targetsRef.current;
    const pops = popsRef.current;
    const now = performance.now();

    for (let index = 0; index < count; index += 1) {
      const target = index <= endIndex ? 1 : 0;

      if (levels[index] === undefined) {
        levels[index] = target;
        from[index] = target;
        starts[index] = now - FILL_MS;
      } else if (levels[index] !== target) {
        from[index] = levels[index];
        starts[index] = now;
      }

      // A tick that changes state swells and settles back to the shared size.
      if (targets[index] !== undefined && targets[index] !== target) {
        pops[index] = now;
      }

      targets[index] = target;
    }

    const positions: number[] = [];
    let left = 0;
    for (let index = 0; index < count; index += 1) {
      positions.push(left);
      left += baseGap + (index < extraGaps ? 1 : 0);
    }

    const paint = () => {
      const time = performance.now();
      let moving = false;

      context.clearRect(0, 0, deviceWidth, heightDevice);

      for (let index = 0; index < count; index += 1) {
        const target = index <= endIndex ? 1 : 0;
        const started = starts[index] ?? 0;
        const progress = clamp((time - started) / FILL_MS, 0, 1);
        const level = from[index] + (target - from[index]) * easeOut(progress);

        levels[index] = level;
        if (progress < 1) moving = true;

        const popProgress = pops[index]
          ? clamp((time - pops[index]) / POP_MS, 0, 1)
          : 1;
        if (popProgress < 1) moving = true;

        const swell = 1 + (POP_SCALE - 1) * Math.sin(Math.PI * popProgress);
        const height = Math.min(
          heightDevice,
          Math.round(restHeightDevice * swell),
        );
        const top = Math.round((heightDevice - height) / 2);

        const red = Math.round(EMPTY[0] + (FILLED[0] - EMPTY[0]) * level);
        const green = Math.round(EMPTY[1] + (FILLED[1] - EMPTY[1]) * level);
        const blue = Math.round(EMPTY[2] + (FILLED[2] - EMPTY[2]) * level);
        const alpha = EMPTY_ALPHA + (1 - EMPTY_ALPHA) * level;

        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(3)})`;
        context.beginPath();
        context.roundRect(
          positions[index],
          top,
          tickDevice,
          height,
          Math.min(radiusDevice, tickDevice / 2, height / 2),
        );
        context.fill();
      }

      frameRef.current = moving ? requestAnimationFrame(paint) : null;
    };

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    paint();

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [
    count,
    endIndex,
    deviceWidth,
    heightDevice,
    restHeightDevice,
    tickDevice,
    radiusDevice,
    baseGap,
    extraGaps,
  ]);

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
      <canvas
        ref={canvasRef}
        aria-hidden
        className="block"
        style={{
          // Matching the bitmap to the device resolution keeps the browser from
          // resampling it, and the nudge lands its left edge on a whole device
          // pixel so no tick gets clipped differently from the rest.
          width: width ? `${deviceWidth / ratio}px` : "100%",
          height: width ? `${heightDevice / ratio}px` : `${BOX_HEIGHT}px`,
          transform: snap ? `translateX(${-snap}px)` : undefined,
        }}
      />
    </div>
  );
}
