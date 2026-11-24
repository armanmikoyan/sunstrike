"use client";

import { useCallback, useRef, useState, type FocusEvent } from "react";

type HoverIndicator = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  instant: boolean;
};

const IDLE: HoverIndicator = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false,
  instant: false,
};

export function useHoverIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<HoverIndicator>(IDLE);

  const show = useCallback((item: HTMLElement, instant?: boolean) => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setIndicator((current) => ({
      x: itemRect.left - containerRect.left,
      y: itemRect.top - containerRect.top,
      width: itemRect.width,
      height: itemRect.height,
      visible: true,
      instant: instant ?? !current.visible,
    }));
  }, []);

  const hide = useCallback(() => {
    setIndicator((current) => (current.visible ? { ...current, visible: false } : current));
  }, []);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
        hide();
      }
    },
    [hide],
  );

  return { containerRef, indicator, show, hide, handleBlur };
}
