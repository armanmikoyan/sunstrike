"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Coins,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  UserRound,
} from "lucide-react";
import { LogoLockup } from "@/components/brand";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account-menu";
import {
  ACCOUNT,
  CTA_BEVEL,
  accountLinks,
  accountMenuCopy,
  primaryLinks,
  secondaryLinks,
  sidebarCopy,
} from "./constants";
import { useIsActive } from "./hooks";
import { RailTooltip } from "./rail-tooltip";
import { SidebarItem } from "./sidebar-item";
import type { SidebarBodyProps } from "./types";

export function SidebarBody({
  expanded,
  onToggle,
  showToggle = true,
  onNavigate,
  inlineAccount = false,
}: SidebarBodyProps) {
  const isActive = useIsActive();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // The drawer's account pane sits over the footer links, so it needs the same
  // dismissal every other dropdown has: a tap away or Escape closes it.
  useEffect(() => {
    if (!accountOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center">
      <div
        className={cn(
          "mb-4 flex h-11 w-full shrink-0 items-center gap-2",
          showToggle ? undefined : "pl-2.5",
        )}
      >
        {showToggle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                aria-label={expanded ? sidebarCopy.collapse : sidebarCopy.expand}
                aria-expanded={expanded}
                className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-white/[0.055]"
              >
                {expanded ? (
                  <PanelLeftClose className="size-4" strokeWidth={1.8} />
                ) : (
                  <PanelLeftOpen className="size-4" strokeWidth={1.8} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              {expanded ? sidebarCopy.collapse : sidebarCopy.expand}
            </TooltipContent>
          </Tooltip>
        ) : null}
        <LogoLockup
          compact
          imageClassName={showToggle ? undefined : "max-h-7"}
          inactive={!expanded}
          className={cn(
            "min-w-0 overflow-hidden",
            expanded ? "flex opacity-100" : "hidden",
          )}
        />
      </div>

      <RailTooltip expanded={expanded} label={sidebarCopy.newGeneration}>
        <Link
          href="/create/video"
          onClick={onNavigate}
          aria-label={sidebarCopy.newGeneration}
          className={cn(
            "group relative mb-4 flex h-9 w-full shrink-0 items-center gap-2 overflow-hidden rounded-lg bg-brand text-sm font-semibold lg:text-[0.75rem] text-brand-foreground transition-[max-width,padding,opacity,transform,background-color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-hover active:scale-[0.97] motion-reduce:transition-none",
            expanded
              ? showToggle
                ? "max-w-[11.25rem] px-2.5"
                : "max-w-full px-2.5"
              : "max-w-9 px-[0.5625rem]",
          )}
          style={{ boxShadow: CTA_BEVEL }}
        >
          <Plus className="size-5 shrink-0" strokeWidth={2.2} />
          <span
            className={cn(
              "truncate transition-opacity duration-200 motion-reduce:transition-none",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            {sidebarCopy.newGeneration}
          </span>
        </Link>
      </RailTooltip>

      <nav
        aria-label={sidebarCopy.studio}
        className="flex w-full shrink-0 flex-col gap-1.5"
      >
        {primaryLinks.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            expanded={expanded}
            rail={showToggle}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-1.5 pt-4">
        {secondaryLinks.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            expanded={expanded}
            rail={showToggle}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}

        <div
          className={cn(
            "my-2 h-px w-full max-w-7 self-center bg-border transition-[max-width] duration-[260ms] motion-reduce:transition-none",
            expanded
              ? showToggle
                ? "max-w-[11.25rem]"
                : "max-w-full"
              : "max-w-7",
          )}
        />

        {expanded && inlineAccount ? (
          <div ref={accountRef} className="relative w-full">
            {accountOpen ? (
              // Floats over Pricing and Help instead of pushing them up, so
              // the drawer body never reflows when the account pane opens.
              <div className="absolute inset-x-0 bottom-full z-20 mb-1.5 flex flex-col gap-0.5 rounded-lg border border-white/[0.08] bg-[#17191c] p-1.5 shadow-[0_1.25rem_3rem_-0.75rem_rgba(0,0,0,0.85)]">
                <Link
                  href="/settings/billing"
                  onClick={onNavigate}
                  className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground lg:text-[0.6875rem]"
                >
                  <Coins className="size-3.5" />
                  {accountMenuCopy.balance}
                  <span className="tabular-nums font-normal ml-auto text-xs text-foreground lg:text-[0.6875rem]">{ACCOUNT.balance}</span>
                  <Plus className="size-3.5" />
                </Link>
                {accountLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground lg:text-[0.6875rem]"
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground lg:text-[0.6875rem]"
                >
                  <LogOut className="size-3.5" />
                  {accountMenuCopy.signOut}
                </button>
              </div>
            ) : null}

            <button
              type="button"
              aria-label={sidebarCopy.accountMenu}
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((value) => !value)}
              className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-foreground ring-1 ring-white/10">
                <UserRound className="size-3.5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">
                  {ACCOUNT.email}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                  accountOpen && "rotate-180",
                )}
              />
            </button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={sidebarCopy.accountMenu}
                className={cn(
                  "flex w-full shrink-0 items-center self-center overflow-hidden rounded-lg text-left text-muted-foreground outline-none transition-[max-width,height,padding,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground focus-visible:bg-white/[0.055] motion-reduce:transition-none",
                  expanded
                    ? showToggle
                      ? "h-9 max-w-[11.25rem] gap-2.5 px-2"
                      : "h-9 max-w-full gap-2.5 px-2"
                    : "h-9 max-w-9 gap-0 pl-1",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-foreground ring-1 ring-white/10">
                  <UserRound className="size-3.5" strokeWidth={1.8} />
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 transition-opacity duration-200 motion-reduce:transition-none",
                    expanded ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">
                    {ACCOUNT.email}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <AccountMenu
              side={expanded ? "top" : "right"}
              align={expanded ? "start" : "end"}
            />
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
