"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { EXIT_MS } from "./constants";

export function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/create/video") return pathname.startsWith("/create");
    return pathname === href;
  };
}

export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, open, onDismiss]);
}

export function useMobileSidebarDrawer(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  returnFocusRef?: RefObject<HTMLButtonElement | null>,
) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const lastPathname = useRef(pathname);
  const wasOpen = useRef(open);
  const [rendered, setRendered] = useState(open);

  if (open && !rendered) {
    setRendered(true);
  }

  useEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;

    try {
      navigator.vibrate?.(open ? 12 : 8);
    } catch {}
  }, [open]);

  useEffect(() => {
    if (open) return;

    const timer = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

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
    overlay.animate(open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], timing);
  }, [open, rendered]);

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

  return { rendered, panelRef, overlayRef };
}
