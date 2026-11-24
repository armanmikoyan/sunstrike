"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useHoverIndicator } from "@/hooks/use-hover-indicator";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { IconBox } from "@/ui/icon-box";
import type { MegaMenuFeaturesProps } from "./types";

export function MegaMenuFeatures({ features, onClose }: MegaMenuFeaturesProps) {
  const { containerRef, indicator, show, hide, handleBlur } = useHoverIndicator();
  const reduceMotion = useReducedMotion();
  const move = indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING;

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-1 gap-x-4 gap-y-1 border-b border-white/7 p-4 sm:grid-cols-2 lg:border-b-0 lg:border-r"
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
            className="group relative flex items-start gap-3 rounded-lg p-2"
          >
            <IconBox className="mt-0.5 bg-white/3 transition-colors group-hover:bg-white/6 group-hover:text-foreground">
              <Icon className="size-3.75" strokeWidth={1.8} />
            </IconBox>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm font-medium text-foreground lg:text-xs">
                {feature.name}
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground lg:text-[0.6875rem]">
                {feature.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
