"use client";

import { useCallback, useState } from "react";
import { Link } from "@/components/link";
import { DropdownMenu, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "cn";
import { useLoginHref, useSessionUser, useSignOut } from "@/components/auth/hooks";
import { useDelayedClose } from "@/hooks/use-delayed-close";
import { AccountAvatar } from "./account-avatar";
import { AccountRowLabel } from "./account-row-label";
import { ACCOUNT_MENU_CLOSE_DELAY_MS, ACCOUNT_MENU_COPY, SIDEBAR_COPY } from "./constants";
import { AccountMenu } from "./account-menu";
import { RailTooltip } from "./rail-tooltip";
import type { SidebarAccountTriggerProps } from "./types";

export function SidebarAccountTrigger({ expanded, showToggle }: SidebarAccountTriggerProps) {
  const { user, loading } = useSessionUser();
  const { signOut, pending } = useSignOut();
  const loginHref = useLoginHref();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { schedule: closeSoon, cancel: cancelClose } = useDelayedClose(close, ACCOUNT_MENU_CLOSE_DELAY_MS);
  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const rowClass = cn(
    "flex w-full shrink-0 items-center self-center overflow-hidden rounded-lg px-1 text-left text-muted-foreground outline-none transition-[max-width,height,color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:bg-white/5.5 motion-reduce:transition-none",
    expanded ? (showToggle ? "h-9 max-w-45 gap-2.5" : "h-9 max-w-full gap-2.5") : "h-9 max-w-9 gap-2.5",
  );

  if (loading) {
    return (
      <div aria-hidden className={rowClass}>
        <AccountAvatar variant="loading" />
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
          <AccountAvatar variant="login" />
          <AccountRowLabel visible={expanded}>{ACCOUNT_MENU_COPY.login}</AccountRowLabel>
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
          <AccountAvatar avatarUrl={user.avatarUrl} />
          <AccountRowLabel visible={expanded}>{user.email ?? ACCOUNT_MENU_COPY.account}</AccountRowLabel>
        </button>
      </DropdownMenuTrigger>
      <AccountMenu
        side={expanded ? "top" : "right"}
        align={expanded ? "start" : "end"}
        email={user.email}
        avatarUrl={user.avatarUrl}
        onSignOut={signOut}
        onPointerEnter={cancelClose}
        onPointerLeave={closeSoon}
        pending={pending}
      />
    </DropdownMenu>
  );
}
