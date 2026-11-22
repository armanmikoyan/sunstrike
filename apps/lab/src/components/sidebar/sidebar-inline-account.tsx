"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Coins, LogIn, LogOut, Plus, UserRound } from "lucide-react";
import { cn } from "cn";
import { useSessionUser, useSignOut } from "@/components/auth/hooks";
import { ACCOUNT, ACCOUNT_LINKS, ACCOUNT_MENU_COPY, SIDEBAR_COPY } from "./constants";
import type { SidebarInlineAccountProps } from "./types";

/**
 * Drawer account row. Its pane floats over the footer links, so opening it
 * never pushes Pricing and Help around.
 */
export function SidebarInlineAccount({ onNavigate }: SidebarInlineAccountProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useSessionUser();
  const { signOut, pending } = useSignOut();

  // A tap away or Escape closes it, matching every other dropdown.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!loading && !user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        aria-label={ACCOUNT_MENU_COPY.login}
        className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-foreground ring-1 ring-white/10">
          <LogIn className="size-3.5" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">
            {ACCOUNT_MENU_COPY.login}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {open ? (
        <div className="absolute inset-x-0 bottom-full z-20 mb-1.5 flex flex-col gap-0.5 rounded-lg border border-white/8 bg-[#17191c] p-1.5 shadow-[0_1.25rem_3rem_-0.75rem_rgba(0,0,0,0.85)]">
          <Link
            href="/settings/billing"
            onClick={onNavigate}
            className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:text-[0.6875rem]"
          >
            <Coins className="size-3.5" />
            {ACCOUNT_MENU_COPY.balance}
            <span className="tabular-nums font-normal ml-auto text-xs text-foreground lg:text-[0.6875rem]">
              {ACCOUNT.balance}
            </span>
            <Plus className="size-3.5" />
          </Link>
          {ACCOUNT_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground lg:text-[0.6875rem]"
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
              void signOut();
            }}
            className="flex h-8 items-center gap-2 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-50 lg:text-[0.6875rem]"
          >
            <LogOut className="size-3.5" />
            {ACCOUNT_MENU_COPY.signOut}
          </button>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={SIDEBAR_COPY.accountMenu}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-foreground ring-1 ring-white/10">
          <UserRound className="size-3.5" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">
            {user?.email ?? ACCOUNT_MENU_COPY.account}
          </span>
        </span>
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
