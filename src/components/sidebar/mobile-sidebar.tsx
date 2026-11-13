"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose } from "lucide-react";
import { EXIT_MS, sidebarCopy } from "./constants";
import { SidebarBody } from "./sidebar-body";
import type { MobileSidebarProps } from "./types";

export function MobileSidebar({
  open,
  onOpenChange,
  returnFocusRef,
}: MobileSidebarProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const lastPathname = useRef(pathname);
  const [rendered, setRendered] = useState(open);

  // Mount during render when it opens: that keeps the panel in the same commit
  // as the trigger, so the opening keyframes are never skipped.
  if (open && !rendered) {
    setRendered(true);
  }

  // Stay mounted through the exit animation, then drop the panel.
  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Explicit keyframes: they always start from off-screen, so the motion is
  // never collapsed into the first paint the way a CSS transition can be.
  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = {
      duration: reduce ? 140 : 260,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
      fill: "both" as const,
    };

    panel.animate(
      open
        ? [{ transform: "translateX(-100%)" }, { transform: "translateX(0%)" }]
        : [{ transform: "translateX(0%)" }, { transform: "translateX(-100%)" }],
      timing,
    );
    overlay.animate(
      open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
      timing,
    );
  }, [open, rendered]);

  // Close only when the route actually changes, not on mount or when the
  // parent hands us a fresh callback.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const query = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (query.matches) onOpenChange(false);
    };

    closeOnDesktop();
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (rendered) panelRef.current?.focus();
  }, [rendered]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    const focusTarget = returnFocusRef?.current;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      focusTarget?.focus();
    };
  }, [open, onOpenChange, returnFocusRef]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        ref={overlayRef}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 size-full cursor-default bg-black/55 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={sidebarCopy.navigation}
        tabIndex={-1}
        className="glass-menu absolute inset-y-0 left-0 flex w-[80%] max-w-[27.5rem] transform-gpu flex-col rounded-r-2xl border-r border-white/10 outline-none will-change-transform"
        style={{ height: "100dvh" }}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={sidebarCopy.closeNavigation}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <PanelLeftClose className="size-[1.125rem]" strokeWidth={1.8} />
        </button>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5">
          <SidebarBody
            expanded
            showToggle={false}
            inlineAccount
            onToggle={() => onOpenChange(false)}
            onNavigate={() => onOpenChange(false)}
          />
        </div>
      </div>
    </div>
  );
}
