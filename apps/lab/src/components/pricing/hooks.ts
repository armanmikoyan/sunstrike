"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  BOX_HEIGHT,
  EMPTY,
  EMPTY_ALPHA,
  FILL_MS,
  FILLED,
  PITCH,
  POP_MS,
  POP_SCALE,
  PRICING_COPY,
  TICK_HEIGHT,
  TICK_RADIUS,
  TICK_WIDTH,
} from "./constants";
import type {
  GenerationKind,
  PricingTopUpEstimateProps,
  SegmentedSliderProps,
  SliderDrag,
  SliderProps,
  TickLayout,
} from "./types";
import { clamp, easeOut, modelCapacity } from "./utils";

export function useSegmentedSlider({
  value,
  min,
  max,
  step,
  onValueChange,
  ticks = 66,
}: Pick<SegmentedSliderProps, "value" | "min" | "max" | "step" | "onValueChange" | "ticks">) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levelsRef = useRef<number[]>([]);
  const startRef = useRef<number[]>([]);
  const fromRef = useRef<number[]>([]);
  const targetsRef = useRef<number[]>([]);
  const popsRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [layout, setLayout] = useState<TickLayout>({ width: 0, ratio: 1, snap: 0 });

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
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const toFraction = useCallback(
    (amount: number) => Math.log(clamp(amount, min, max) / min) / Math.log(max / min),
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
  const heightDevice = Math.max(restHeightDevice, Math.round(BOX_HEIGHT * ratio));
  const radiusDevice = Math.max(1, Math.round(TICK_RADIUS * ratio));
  const count = width ? clamp(Math.round(width / PITCH) + 1, 16, ticks) : 0;

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

        const popProgress = pops[index] ? clamp((time - pops[index]) / POP_MS, 0, 1) : 1;
        if (popProgress < 1) moving = true;

        const swell = 1 + (POP_SCALE - 1) * Math.sin(Math.PI * popProgress);
        const height = Math.min(heightDevice, Math.round(restHeightDevice * swell));
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
  }, [count, endIndex, deviceWidth, heightDevice, restHeightDevice, tickDevice, radiusDevice, baseGap, extraGaps]);

  return {
    trackRef,
    canvasRef,
    dragging,
    setDragging,
    setFromClientX,
    handleKeyDown,
    canvasStyle: {
      width: width ? `${deviceWidth / ratio}px` : "100%",
      height: width ? `${heightDevice / ratio}px` : `${BOX_HEIGHT}px`,
      transform: snap ? `translateX(${-snap}px)` : undefined,
    },
  };
}

export function useDrumDrag({
  value,
  min,
  max,
  onValueChange,
}: Pick<SliderProps, "value" | "min" | "max" | "onValueChange">) {
  const dragRef = useRef<SliderDrag | null>(null);

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

    onValueChange(clamp(next, min, max));
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

  const clearDrag = () => {
    dragRef.current = null;
  };

  return { handlePointerDown, handlePointerMove, endDrag, clearDrag };
}

export function useTopUpEstimate({ videoModels, imageModels, amount }: PricingTopUpEstimateProps) {
  const [mode, setMode] = useState<GenerationKind>("video");
  const [videoSlug, setVideoSlug] = useState(videoModels[0]?.slug ?? "");
  const [imageSlug, setImageSlug] = useState(imageModels[0]?.slug ?? "");

  const models = mode === "video" ? videoModels : imageModels;
  const activeSlug = mode === "video" ? videoSlug : imageSlug;
  const selectedModel = models.find((model) => model.slug === activeSlug) ?? models[0];
  const rate = selectedModel ? (mode === "video" ? (selectedModel.perSecond ?? 0) : (selectedModel.perImage ?? 0)) : 0;
  const capacity = modelCapacity(selectedModel, mode, amount, PRICING_COPY.topUps.custom.videoSeconds);
  const unit = mode === "video" ? PRICING_COPY.topUps.videos : PRICING_COPY.topUps.images;

  const setSelectedSlug = (slug: string) => {
    if (mode === "video") {
      setVideoSlug(slug);
    } else {
      setImageSlug(slug);
    }
  };

  return { mode, setMode, models, selectedModel, rate, capacity, unit, setSelectedSlug };
}
