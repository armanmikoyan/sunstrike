"use client";

import { useMobileSidebarDrawer } from "./hooks";
import { MobileSidebarPanel } from "./mobile-sidebar-panel";
import type { MobileSidebarProps } from "./types";

export function MobileSidebar({ open, onOpenChange, returnFocusRef }: MobileSidebarProps) {
  const { rendered, panelRef, overlayRef } = useMobileSidebarDrawer(open, onOpenChange, returnFocusRef);

  if (!rendered) return null;

  return <MobileSidebarPanel panelRef={panelRef} overlayRef={overlayRef} onClose={() => onOpenChange(false)} />;
}
