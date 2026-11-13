"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { instantTransition, layoutSpring } from "@/lib/motion";
import type { AnimatedHeightProps } from "./types";

/**
 * Wraps content whose height changes when its children swap. The inner box is
 * measured with a ResizeObserver and the outer frame springs to that height, so
 * surrounding content glides instead of snapping.
 */
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
      transition={reduceMotion ? instantTransition : layoutSpring}
      className={cn("overflow-hidden", className)}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}
