"use client";

import { PanelLeftClose } from "lucide-react";
import { SIDEBAR_COPY } from "./constants";
import { SidebarBody } from "./sidebar-body";
import type { MobileSidebarPanelProps } from "./types";

export function MobileSidebarPanel({ panelRef, overlayRef, onClose }: MobileSidebarPanelProps) {
  return (
    <div className="fixed inset-0 z-90 lg:hidden">
      <button
        type="button"
        ref={overlayRef}
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 size-full cursor-default bg-black/55 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={SIDEBAR_COPY.navigation}
        tabIndex={-1}
        className="glass-menu absolute inset-y-0 left-0 flex w-4/5 max-w-110 transform-gpu flex-col rounded-r-2xl border-r border-white/10 outline-none will-change-transform"
        style={{ height: "100dvh" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={SIDEBAR_COPY.closeNavigation}
          className="absolute right-3 top-4 z-10 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <PanelLeftClose className="size-4.5" strokeWidth={1.8} />
        </button>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5">
          <SidebarBody expanded showToggle={false} inlineAccount onToggle={onClose} onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
