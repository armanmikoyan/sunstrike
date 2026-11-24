"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "cn";
import { useLoginHref, useSessionUser, useSignOut } from "@/components/auth/hooks";
import { AccountAvatar } from "./account-avatar";
import { ACCOUNT_MENU_COPY, SIDEBAR_COPY } from "./constants";
import { AccountMenu } from "./account-menu";
import { RailTooltip } from "./rail-tooltip";
import type { SidebarAccountTriggerProps } from "./types";

/** Rail account row; the menu opens on the side the rail points to. */
export function SidebarAccountTrigger({ expanded, showToggle }: SidebarAccountTriggerProps) {
  const { user, loading } = useSessionUser();
  const { signOut, pending } = useSignOut();
  const loginHref = useLoginHref();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);
  const closeSoon = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  }, [cancelClose]);
  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  const rowClass = cn(
    "flex w-full shrink-0 items-center self-center overflow-hidden rounded-lg px-1 text-left text-muted-foreground outline-none transition-[max-width,height,color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:bg-white/5.5 motion-reduce:transition-none",
    expanded ? (showToggle ? "h-9 max-w-45 gap-2.5" : "h-9 max-w-full gap-2.5") : "h-9 max-w-9 gap-2.5",
  );

  if (loading) {
    return (
      <div aria-hidden className={rowClass}>
        <span className="size-7 shrink-0 animate-pulse rounded-full bg-secondary motion-reduce:animate-none ring-1 ring-white/10" />
        <span className={cn("min-w-0 flex-1", expanded ? "opacity-100" : "opacity-0")}>
          <span className="block h-2 w-16 animate-pulse rounded-full bg-secondary motion-reduce:animate-none" />
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <RailTooltip expanded={expanded} label={ACCOUNT_MENU_COPY.login}>
        <Link href={loginHref} aria-label={ACCOUNT_MENU_COPY.login} className={cn(rowClass, "hover:bg-secondary")}>
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-foreground ring-1 ring-white/10">
            <LogIn className="size-3.5" strokeWidth={1.8} />
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 transition-opacity duration-200 motion-reduce:transition-none",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">
              {ACCOUNT_MENU_COPY.login}
            </span>
          </span>
        </Link>
      </RailTooltip>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={SIDEBAR_COPY.accountMenu}
          className={rowClass}
          onPointerEnter={openMenu}
          onPointerLeave={closeSoon}
        >
          <AccountAvatar avatarUrl={user?.avatarUrl} />
          <span
            className={cn(
              "min-w-0 flex-1 transition-opacity duration-200 motion-reduce:transition-none",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">
              {user?.email ?? ACCOUNT_MENU_COPY.account}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <AccountMenu
        side={expanded ? "top" : "right"}
        align={expanded ? "start" : "end"}
        email={user?.email ?? null}
        avatarUrl={user?.avatarUrl ?? null}
        onSignOut={signOut}
        onPointerEnter={cancelClose}
        onPointerLeave={closeSoon}
        pending={pending}
      />
    </DropdownMenu>
  );
}
