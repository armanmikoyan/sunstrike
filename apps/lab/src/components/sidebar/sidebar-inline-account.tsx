"use client";

import { useCallback, useRef, useState } from "react";
import { Link } from "@/components/link";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import { useLoginHref, useSessionUser, useSignOut } from "@/components/auth/hooks";
import { AccountAvatar } from "./account-avatar";
import { AccountRowLabel } from "./account-row-label";
import { ACCOUNT_MENU_COPY, SIDEBAR_COPY } from "./constants";
import { useDismiss } from "./hooks";
import { SidebarInlinePane } from "./sidebar-inline-pane";
import type { SidebarInlineAccountProps } from "./types";

export function SidebarInlineAccount({ onNavigate }: SidebarInlineAccountProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useSessionUser();
  const { signOut, pending } = useSignOut();
  const loginHref = useLoginHref();
  const close = useCallback(() => setOpen(false), []);

  useDismiss(containerRef, open, close);

  if (loading) {
    return (
      <div aria-hidden className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2">
        <AccountAvatar variant="loading" />
        <span className="h-2 w-20 animate-pulse rounded-full bg-secondary motion-reduce:animate-none" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href={loginHref}
        onClick={onNavigate}
        aria-label={ACCOUNT_MENU_COPY.login}
        className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
      >
        <AccountAvatar variant="login" />
        <AccountRowLabel>{ACCOUNT_MENU_COPY.login}</AccountRowLabel>
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {open ? (
        <SidebarInlinePane
          pending={pending}
          onNavigate={onNavigate}
          onSignOut={() => {
            setOpen(false);
            onNavigate?.();
            void signOut();
          }}
        />
      ) : null}

      <button
        type="button"
        aria-label={SIDEBAR_COPY.accountMenu}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-muted-foreground outline-none transition-colors hover:text-foreground"
      >
        <AccountAvatar avatarUrl={user.avatarUrl} />
        <AccountRowLabel>{user.email ?? ACCOUNT_MENU_COPY.account}</AccountRowLabel>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}
