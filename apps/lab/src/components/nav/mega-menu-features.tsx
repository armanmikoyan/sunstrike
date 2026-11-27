"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useHoverIndicator } from "@/hooks/use-hover-indicator";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import type { MegaMenuFeaturesProps } from "./types";

export function MegaMenuFeatures({ features, onClose }: MegaMenuFeaturesProps) {
  const { containerRef, indicator, show, hide, handleBlur } = useHoverIndicator();
  const reduceMotion = useReducedMotion();
  const move = indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING;

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-1 content-start gap-x-2 gap-y-0.5 border-b border-white/7 p-3 sm:grid-cols-2 lg:border-b-0 lg:border-r"
      onPointerLeave={hide}
      onBlur={handleBlur}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          x: indicator.x,
          y: indicator.y,
          width: indicator.width,
          height: indicator.height,
          opacity: indicator.visible ? 1 : 0,
        }}
        transition={
          reduceMotion
            ? INSTANT_TRANSITION
            : { x: move, y: move, width: move, height: move, opacity: { duration: 0.2 } }
        }
        className="pointer-events-none absolute top-0 left-0 rounded-lg bg-white/4.5"
      />
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Link
            key={feature.name}
            href={feature.href}
            onClick={onClose}
            onPointerEnter={(event) => show(event.currentTarget)}
            onFocus={(event) => show(event.currentTarget)}
            className="group relative flex items-center gap-3 rounded-lg px-2.5 py-2"
          >
            <Icon
              className="size-5 shrink-0 text-muted-foreground transition-[color,scale] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-115 group-hover:text-brand-secondary group-focus-visible:scale-115 group-focus-visible:text-brand-secondary motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
              strokeWidth={1.8}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground lg:text-xs">{feature.name}</span>
              <span className="block text-xs leading-snug text-muted-foreground lg:text-[0.6875rem]">
                {feature.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
