"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { IconBox } from "@/ui/icon-box";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import type { MegaMenuFeaturesProps, MegaMenuHoverIndicator } from "./types";

const INDICATOR_IDLE: MegaMenuHoverIndicator = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false,
  instant: false,
};

export function MegaMenuFeatures({ features, onClose }: MegaMenuFeaturesProps) {
  const [indicator, setIndicator] = useState(INDICATOR_IDLE);
  const reduceMotion = useReducedMotion();

  const showIndicator = (item: HTMLElement) => {
    const grid = item.closest("[data-mega-features]");
    if (!grid) return;

    const gridRect = grid.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setIndicator((current) => ({
      x: itemRect.left - gridRect.left,
      y: itemRect.top - gridRect.top,
      width: itemRect.width,
      height: itemRect.height,
      visible: true,
      instant: !current.visible,
    }));
  };

  const hideIndicator = () => {
    setIndicator((current) => (current.visible ? { ...current, visible: false } : current));
  };

  return (
    <div
      data-mega-features
      className="relative grid grid-cols-1 gap-x-4 gap-y-1 border-b border-white/7 p-4 sm:grid-cols-2 lg:border-b-0 lg:border-r"
      onPointerLeave={hideIndicator}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          hideIndicator();
        }
      }}
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
            : {
                x: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                y: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                width: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                height: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                opacity: { duration: 0.2 },
              }
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
            onPointerEnter={(event) => showIndicator(event.currentTarget)}
            onFocus={(event) => showIndicator(event.currentTarget)}
            className="group relative flex items-start gap-3 rounded-lg p-2"
          >
            <IconBox className="mt-0.5 bg-white/3 transition-colors group-hover:bg-white/6 group-hover:text-foreground">
              <Icon className="size-3.75" strokeWidth={1.8} />
            </IconBox>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm lg:text-xs font-medium text-foreground">
                {feature.name}
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-0.5 block text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
                {feature.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
