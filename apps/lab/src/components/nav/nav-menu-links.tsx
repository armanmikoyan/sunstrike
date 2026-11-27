"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { useHoverIndicator } from "@/hooks/use-hover-indicator";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { MEGA_MENUS, NAV_COPY } from "./constants";
import type { NavMenuLinksProps } from "./types";

export function NavMenuLinks({ menu }: NavMenuLinksProps) {
  const { containerRef, indicator, show } = useHoverIndicator();
  const reduceMotion = useReducedMotion();
  const move = indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING;

  return (
    <nav aria-label={NAV_COPY.tools} className="hidden min-w-0 flex-1 items-center lg:flex">
      <div ref={containerRef} className="relative flex items-center gap-0.5 p-1">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl bg-[#17191d] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-opacity duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
            menu.openMenu ? "opacity-100" : "opacity-0",
          )}
        />
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            x: indicator.x,
            width: indicator.width,
            opacity: menu.openMenu ? 1 : 0,
            y: "-50%",
          }}
          transition={reduceMotion ? INSTANT_TRANSITION : { x: move, width: move, opacity: { duration: 0.2 } }}
          className="pointer-events-none absolute top-1/2 left-0 h-8 rounded-lg bg-secondary"
        />
        {MEGA_MENUS.map((item) => {
          const active = menu.openMenu === item.key;
          return (
            <div
              key={item.key}
              ref={menu.registerTrigger(item.key)}
              className="relative shrink-0"
              onMouseEnter={(event) => {
                show(event.currentTarget, menu.openMenu === null);
                menu.open(item.key);
              }}
              onMouseLeave={menu.scheduleClose}
            >
              <Link
                href={item.href}
                onFocus={(event) => {
                  if (event.currentTarget.parentElement) {
                    show(event.currentTarget.parentElement, menu.openMenu === null);
                  }
                  menu.open(item.key);
                }}
                onClick={menu.close}
                aria-expanded={active}
                className={cn(
                  "relative flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:text-foreground motion-reduce:transition-none lg:text-[0.6875rem]",
                  active && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
