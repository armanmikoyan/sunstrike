"use client";

import { SidebarItem } from "./sidebar-item";
import type { SidebarLinksProps } from "./types";

/** One nav group; the caller decides the surrounding landmark. */
export function SidebarLinks({ links, expanded, rail, isActive, onNavigate }: SidebarLinksProps) {
  return links.map((item) => (
    <SidebarItem
      key={item.href}
      {...item}
      expanded={expanded}
      rail={rail}
      active={isActive(item.href)}
      onNavigate={onNavigate}
    />
  ));
}
