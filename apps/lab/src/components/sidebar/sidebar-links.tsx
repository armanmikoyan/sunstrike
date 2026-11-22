"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { SidebarItem } from "./sidebar-item";
import type { SidebarHoverIndicator, SidebarLinksProps } from "./types";

const INDICATOR_IDLE: SidebarHoverIndicator = { y: 0, width: 0, visible: false, instant: false };

/** One nav group; the caller decides the surrounding landmark. */
export function SidebarLinks({ links, expanded, rail, isActive, onNavigate }: SidebarLinksProps) {
  const [indicator, setIndicator] = useState(INDICATOR_IDLE);
  const reduceMotion = useReducedMotion();

  const showIndicator = (item: HTMLElement) => {
    const group = item.closest("[data-sidebar-group]");
    if (!group) return;

    const groupRect = group.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setIndicator((current) => ({
      y: itemRect.top - groupRect.top,
      width: itemRect.width,
      visible: true,
      instant: !current.visible,
    }));
  };

  const hideIndicator = () => {
    setIndicator((current) => (current.visible ? { ...current, visible: false } : current));
  };

  return (
    <div data-sidebar-group className="relative flex w-full flex-col gap-1.5" onPointerLeave={hideIndicator}>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ y: indicator.y, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
        transition={
          reduceMotion
            ? INSTANT_TRANSITION
            : {
                y: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                width: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                opacity: { duration: 0.2 },
              }
        }
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
          onHover={showIndicator}
        />
      ))}
    </div>
  );
}
