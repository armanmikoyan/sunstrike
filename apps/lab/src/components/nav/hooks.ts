"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useDelayedClose } from "@/hooks/use-delayed-close";
import { MENU_CLOSE_DELAY_MS, PANEL_GUTTER, PANEL_MAX_WIDTH } from "./constants";
import {
  getNarrow,
  getNarrowOnServer,
  getShortcut,
  getShortcutOnServer,
  subscribeNarrow,
  subscribeNothing,
} from "./utils";

export function useShortcutLabel() {
  return useSyncExternalStore(subscribeNothing, getShortcut, getShortcutOnServer);
}

export function useCompactNav() {
  return useSyncExternalStore(subscribeNarrow, getNarrow, getNarrowOnServer);
}

export function useMegaMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState(PANEL_GUTTER);
  const [panelWidth, setPanelWidth] = useState(PANEL_MAX_WIDTH);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const close = useCallback(() => setOpenMenu(null), []);
  const { schedule: scheduleClose, cancel: cancelClose } = useDelayedClose(close, MENU_CLOSE_DELAY_MS);

  const open = useCallback(
    (key: string) => {
      cancelClose();

      const trigger = itemRefs.current[key];
      const header = trigger?.closest("header");
      if (trigger && header) {
        const headerWidth = header.getBoundingClientRect().width;
        const width = Math.max(0, Math.min(PANEL_MAX_WIDTH, headerWidth - PANEL_GUTTER * 2));
        const offset = trigger.getBoundingClientRect().left - header.getBoundingClientRect().left;
        const maxLeft = Math.max(PANEL_GUTTER, headerWidth - width - PANEL_GUTTER);
        setPanelWidth(width);
        setPanelLeft(Math.min(Math.max(PANEL_GUTTER, offset), maxLeft));
      }

      setOpenMenu(key);
    },
    [cancelClose],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  const registerTrigger = useCallback(
    (key: string) => (node: HTMLDivElement | null) => {
      itemRefs.current[key] = node;
    },
    [],
  );

  return {
    openMenu,
    panelLeft,
    panelWidth,
    open,
    close,
    scheduleClose,
    cancelClose,
    registerTrigger,
  };
}
