"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Coins, LogOut, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
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

  return (
    <div className="no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto overscroll-contain">
      <div
        className={cn(
          // The header keeps a fixed height, so the rail's contents cannot jump
          // while the toggle's hit area animates between 40 and 32px.
          "relative mb-4 flex h-11 w-full shrink-0 items-center",
          expanded && !showToggle && "pr-9",
        )}
      >
        <LogoLockup
          compact
          inactive={!expanded}
          className={cn(
            "min-w-0 overflow-hidden transition-opacity duration-200 motion-reduce:transition-none",
            expanded
              ? "opacity-100"
              : "pointer-events-none absolute w-0 opacity-0",
          )}
        />
        {showToggle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                aria-label={expanded ? sidebarCopy.collapse : sidebarCopy.expand}
                aria-expanded={expanded}
                className={cn(
                  // The toggle is the one control that moves from the rail's
                  // centre to its edge, so its offset has to animate with the
                  // rail instead of being re-aligned by the flex row (that made
                  // it teleport across the whole panel on collapse).
                  "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-[right,translate,width,height,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground motion-reduce:transition-none",
                  expanded
                    ? "right-0 size-8 translate-x-0"
                    : "right-1/2 size-10 translate-x-1/2",
                )}
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
      </div>

      <RailTooltip expanded={expanded} label={sidebarCopy.newGeneration}>
        <Link
          href="/create/video"
          onClick={onNavigate}
          aria-label={sidebarCopy.newGeneration}
          className={cn(
            "group relative mb-5 flex h-10 w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-xl bg-brand text-[0.8125rem] font-semibold text-brand-foreground transition-[max-width,padding,opacity,transform,background-color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-hover active:scale-[0.97] motion-reduce:transition-none",
            expanded
              ? showToggle
                ? "max-w-[11.25rem] px-3"
                : "max-w-full px-3"
              : "max-w-10 px-[0.625rem]",
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
        {inlineAccount ? null : (
          <>
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
          </>
        )}

        {expanded && inlineAccount ? (
          <div className="flex w-full flex-col">
            {accountOpen ? (
              <div className="mb-1.5 flex flex-col gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5">
                <Link
                  href="/pricing"
                  onClick={onNavigate}
                  className="flex h-9 items-center gap-2 rounded-lg px-2 text-[0.75rem] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                >
                  <Coins className="size-3.5" />
                  {accountMenuCopy.balance}
                  <span className="ml-auto font-mono tabular-nums text-foreground">
                    {ACCOUNT.balance}
                  </span>
                  <Plus className="size-3.5" />
                </Link>
                {accountLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex h-9 items-center gap-2 rounded-lg px-2 text-[0.75rem] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-lg px-2 text-[0.75rem] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
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
              className="flex h-11 w-full items-center gap-2.5 rounded-xl px-2 text-left text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[0.6875rem] font-medium text-foreground ring-1 ring-white/10">
                {ACCOUNT.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.75rem] font-medium text-foreground">
                  {ACCOUNT.name}
                </span>
                <span className="block truncate text-[0.6875rem]">
                  {ACCOUNT.email}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200",
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
                  "flex w-full shrink-0 items-center self-center overflow-hidden rounded-xl text-left text-muted-foreground outline-none transition-[max-width,height,padding,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-white/25 motion-reduce:transition-none",
                  expanded
                    ? showToggle
                      ? "h-10 max-w-[11.25rem] gap-2.5 px-2"
                      : "h-10 max-w-full gap-2.5 px-2"
                    : "h-10 max-w-10 gap-0 pl-[0.375rem]",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[0.6875rem] font-medium text-foreground ring-1 ring-white/10">
                  {ACCOUNT.initials}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 transition-opacity duration-200 motion-reduce:transition-none",
                    expanded ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="block truncate text-[0.75rem] font-medium text-foreground">
                    {ACCOUNT.name}
                  </span>
                  <span className="block truncate text-[0.6875rem]">
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
