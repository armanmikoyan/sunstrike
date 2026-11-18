"use client";

import { UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "cn";
import { ACCOUNT, SIDEBAR_COPY } from "./constants";
import { AccountMenu } from "./account-menu";
import type { SidebarAccountTriggerProps } from "./types";

/** Rail account row; the menu opens on the side the rail points to. */
export function SidebarAccountTrigger({ expanded, showToggle }: SidebarAccountTriggerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={SIDEBAR_COPY.accountMenu}
          className={cn(
            "flex w-full shrink-0 items-center self-center overflow-hidden rounded-lg px-1 text-left text-muted-foreground outline-none transition-[max-width,height,background-color,color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground focus-visible:bg-white/5.5 motion-reduce:transition-none",
            expanded ? (showToggle ? "h-9 max-w-45 gap-2.5" : "h-9 max-w-full gap-2.5") : "h-9 max-w-9 gap-2.5",
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
      <AccountMenu side={expanded ? "top" : "right"} align={expanded ? "start" : "end"} />
    </DropdownMenu>
  );
}
