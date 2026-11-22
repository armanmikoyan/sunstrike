"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { MEGA_MENUS, NAV_COPY } from "./constants";
import type { NavHoverIndicator, NavMenuLinksProps } from "./types";

const INDICATOR_IDLE: NavHoverIndicator = { x: 0, width: 0, instant: false };

export function NavMenuLinks({ menu }: NavMenuLinksProps) {
  const [indicator, setIndicator] = useState(INDICATOR_IDLE);
  const reduceMotion = useReducedMotion();

  const showIndicator = (item: HTMLElement) => {
    const group = item.closest("[data-nav-group]");
    if (!group) return;

    const groupRect = group.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setIndicator({
      x: itemRect.left - groupRect.left,
      width: itemRect.width,
      instant: menu.openMenu === null,
    });
  };

  return (
    <nav aria-label={NAV_COPY.tools} className="hidden min-w-0 flex-1 items-center lg:flex">
      <div data-nav-group className="relative flex items-center gap-0.5 p-1">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl bg-[#17191d] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-opacity duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
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
          transition={
            reduceMotion
              ? INSTANT_TRANSITION
              : {
                  x: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                  width: indicator.instant ? INSTANT_TRANSITION : LAYOUT_SPRING,
                  opacity: { duration: 0.2 },
                }
          }
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
                showIndicator(event.currentTarget);
                menu.open(item.key);
              }}
              onMouseLeave={menu.scheduleClose}
            >
              <Link
                href={item.href}
                onFocus={(event) => {
                  if (event.currentTarget.parentElement) showIndicator(event.currentTarget.parentElement);
                  menu.open(item.key);
                }}
                onClick={menu.close}
                aria-expanded={active}
                className={cn(
                  "relative flex h-8 items-center gap-1 rounded-lg px-2 text-xs lg:text-[0.6875rem] font-medium text-muted-foreground transition-colors duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:text-foreground motion-reduce:transition-none",
                  active && "text-foreground",
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "size-3 opacity-45 transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
                    active && "rotate-180 opacity-70",
                  )}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
