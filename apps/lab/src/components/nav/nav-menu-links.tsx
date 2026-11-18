"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import { MEGA_MENUS, NAV_COPY } from "./constants";
import type { NavMenuLinksProps } from "./types";

export function NavMenuLinks({ menu }: NavMenuLinksProps) {
  return (
    <nav aria-label={NAV_COPY.tools} className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex">
      {MEGA_MENUS.map((item) => {
        const active = menu.openMenu === item.key;
        return (
          <div
            key={item.key}
            ref={menu.registerTrigger(item.key)}
            className="shrink-0"
            onMouseEnter={() => menu.open(item.key)}
            onMouseLeave={menu.scheduleClose}
          >
            <Link
              href={item.href}
              onFocus={() => menu.open(item.key)}
              onClick={menu.close}
              aria-expanded={active}
              className={cn(
                "flex h-8 items-center gap-1 rounded-lg px-2 text-xs lg:text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:bg-white/4 hover:text-foreground",
                active && "bg-white/5.5 text-foreground",
              )}
            >
              {item.label}
              <ChevronDown
                className={cn("size-3 opacity-45 transition-transform", active && "rotate-180 opacity-70")}
              />
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
