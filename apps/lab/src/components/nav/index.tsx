"use client";

import { Link } from "@/components/link";
import { PanelLeft } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { cn } from "cn";
import { MEGA_MENUS, NAV_COPY } from "./constants";
import { useMegaMenu } from "./hooks";
import { MegaMenuPanel } from "./mega-menu-panel";
import { NavBalance } from "./nav-balance";
import { NavMenuLinks } from "./nav-menu-links";
import { NavNotifications } from "./nav-notifications";
import { NavSearch } from "./nav-search";
import type { TopNavProps } from "./types";

export function TopNav({ onOpenMenu, menuButtonRef }: TopNavProps) {
  const menu = useMegaMenu();
  const activeMenu = MEGA_MENUS.find((item) => item.key === menu.openMenu) ?? null;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 z-30 bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.9))] transition-opacity duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
          activeMenu ? "opacity-100" : "opacity-0",
        )}
      />
      <header className="chrome-bar sticky top-0 z-40 h-12 border-b border-border" onMouseLeave={menu.scheduleClose}>
        <div className="flex h-full w-full items-center gap-2 pl-3 pr-2 sm:pl-5 lg:pl-8">
          <button
            type="button"
            ref={menuButtonRef}
            onClick={onOpenMenu}
            aria-label={NAV_COPY.openNavigation}
            className="-ml-1 grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:hidden"
          >
            <PanelLeft className="size-4.5" strokeWidth={1.8} />
          </button>
          <Link
            href="/"
            aria-label={NAV_COPY.home}
            className="-ml-3 shrink-0 rounded-xl py-1 pr-1.5 pl-2.5 outline-none transition-colors hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <BrandMark className="size-7 sm:size-8" />
          </Link>

          <NavMenuLinks menu={menu} />

          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 lg:flex-none">
            <NavSearch />
            <NavBalance />
            <NavNotifications />
          </div>
        </div>

        {activeMenu ? (
          <div onMouseEnter={menu.cancelClose} onMouseLeave={menu.scheduleClose} className="hidden lg:block">
            <MegaMenuPanel menu={activeMenu} onClose={menu.close} left={menu.panelLeft} width={menu.panelWidth} />
          </div>
        ) : null}
      </header>
    </>
  );
}
