"use client";

import { motion, useReducedMotion } from "motion/react";
import { useHoverIndicator } from "@/hooks/use-hover-indicator";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { SidebarItem } from "./sidebar-item";
import type { SidebarLinksProps } from "./types";

export function SidebarLinks({ links, expanded, rail, isActive, onNavigate }: SidebarLinksProps) {
  const { containerRef, indicator, show, hide } = useHoverIndicator();
  const reduceMotion = useReducedMotion();
  const move = indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING;

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5" onPointerLeave={hide}>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ y: indicator.y, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
        transition={reduceMotion ? INSTANT_TRANSITION : { y: move, width: move, opacity: { duration: 0.2 } }}
        className="pointer-events-none absolute top-0 left-0 h-9 rounded-lg bg-secondary"
      />
      {links.map((item) => (
        <SidebarItem
          key={item.href}
          {...item}
          expanded={expanded}
          rail={rail}
          active={isActive(item.href)}
          onNavigate={onNavigate}
          onHover={show}
        />
      ))}
    </div>
  );
}
