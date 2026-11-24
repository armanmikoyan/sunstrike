"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import type { AnimatedHeightProps } from "./types";

export function AnimatedHeight({ children, className }: AnimatedHeightProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = innerRef.current;
    if (!element) return;

    const update = () => setHeight(element.offsetHeight);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height: height ?? "auto" }}
      transition={reduceMotion ? INSTANT_TRANSITION : LAYOUT_SPRING}
      className={cn("overflow-hidden", className)}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}
