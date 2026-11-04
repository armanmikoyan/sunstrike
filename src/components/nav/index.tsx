"use client";

import Link from "next/link";
import Script from "next/script";
import { ChevronDown, PanelLeft } from "lucide-react";
import { Chronosphere } from "@/components/brand";
import { cn } from "@/lib/utils";
import { megaMenus } from "./constants";
import { useMegaMenu } from "./hooks";
import { MegaMenuPanel } from "./mega-menu-panel";
import { NavBalance } from "./nav-balance";
import { NavNotifications } from "./nav-notifications";
import { NavSearch } from "./nav-search";
import type { TopNavProps } from "./types";

export function TopNav({ onOpenMenu, menuButtonRef }: TopNavProps) {
  const {
    openMenu,
    panelLeft,
    open,
    close,
    scheduleClose,
    cancelClose,
    registerTrigger,
  } = useMegaMenu();

  const activeMenu =
    megaMenus.find((menu) => menu.key === openMenu) ?? null;

  return (
    <header
      className="sticky top-0 z-40 h-12 border-b border-border bg-background/95"
      onMouseLeave={scheduleClose}
    >
      <Script src="/brand/violet-orb.js" strategy="afterInteractive" />
      <div className="flex h-full w-full items-center gap-2 pl-3 pr-2 sm:pl-5">
        <button
          type="button"
          ref={menuButtonRef}
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="-ml-1 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground lg:hidden"
        >
          <PanelLeft className="size-[1.125rem]" strokeWidth={1.8} />
        </button>
        <Link
          href="/"
          aria-label="Chronolab.ai home"
          className="shrink-0"
        >
          <Chronosphere className="size-8 sm:size-9" />
        </Link>

        <nav
          aria-label="Studio tools"
          className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex"
        >
          {megaMenus.map((menu) => {
            const active = openMenu === menu.key;
            return (
              <div
                key={menu.key}
                ref={registerTrigger(menu.key)}
                className="shrink-0"
                onMouseEnter={() => open(menu.key)}
              >
                <Link
                  href={menu.href}
                  onFocus={() => open(menu.key)}
                  onClick={close}
                  aria-expanded={active}
                  className={cn(
                    "flex h-9 items-center gap-1 rounded-lg px-3 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
                    active && "bg-white/[0.055] text-foreground",
                  )}
                >
                  {menu.label}
                  <ChevronDown
                    className={cn(
                      "size-3 opacity-45 transition-transform",
                      active && "rotate-180 opacity-70",
                    )}
                  />
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 lg:flex-none">
          <NavSearch />
          <NavBalance />
          <NavNotifications />
        </div>
      </div>

      {activeMenu ? (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="hidden lg:block"
        >
          <MegaMenuPanel
            menu={activeMenu}
            onClose={close}
            left={panelLeft}
          />
        </div>
      ) : null}
    </header>
  );
}
