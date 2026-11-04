"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const NARROW_QUERY = "(max-width: 767px)";

/** Nothing to subscribe to: the platform never changes during a session. */
const subscribeNothing = () => () => {};

const getShortcut = () =>
  /Mac|iPhone|iPad/.test(navigator.userAgent) ? "\u2318 K" : "Ctrl K";
const getShortcutOnServer = () => "Ctrl K";

const subscribeNarrow = (onChange: () => void) => {
  const media = window.matchMedia(NARROW_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const getNarrow = () => window.matchMedia(NARROW_QUERY).matches;
const getNarrowOnServer = () => false;

/** The platform's own hotkey label, resolved after mount so hydration is quiet. */
export function useShortcutLabel() {
  return useSyncExternalStore(
    subscribeNothing,
    getShortcut,
    getShortcutOnServer,
  );
}

export function useCompactNav() {
  return useSyncExternalStore(subscribeNarrow, getNarrow, getNarrowOnServer);
}

/**
 * The mega-menu's open key plus the panel offset, which is measured from the
 * trigger so the panel lines up with the item that opened it.
 */
export function useMegaMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState(0);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const open = useCallback(
    (key: string) => {
      cancelClose();

      const trigger = itemRefs.current[key];
      const header = trigger?.closest("header");
      if (trigger && header) {
        const panelWidth = Math.min(1000, window.innerWidth - 32);
        const offset =
          trigger.getBoundingClientRect().left -
          header.getBoundingClientRect().left;
        setPanelLeft(
          Math.max(8, Math.min(offset, window.innerWidth - panelWidth - 16)),
        );
      }

      setOpenMenu(key);
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 110);
  }, [cancelClose]);

  const close = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const registerTrigger = useCallback(
    (key: string) => (node: HTMLDivElement | null) => {
      itemRefs.current[key] = node;
    },
    [],
  );

  return {
    openMenu,
    panelLeft,
    open,
    close,
    scheduleClose,
    cancelClose,
    registerTrigger,
  };
}
