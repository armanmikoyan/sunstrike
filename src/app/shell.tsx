"use client";

import { useRef, useState, type ReactNode } from "react";
import { atom, useAtom } from "jotai";
import { MobileSidebar, Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/nav";

/**
 * Lives in the root Jotai provider, so the rail keeps its state when a
 * navigation swaps between the `(website)` and `(workspace)` layouts.
 */
const railExpandedAtom = atom(false);

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useAtom(railExpandedAtom);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[120rem] bg-background">
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((value) => !value)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav
            onOpenMenu={() => setMobileNavOpen(true)}
            menuButtonRef={menuButtonRef}
          />
          {children}
        </div>
      </div>
      <MobileSidebar
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        returnFocusRef={menuButtonRef}
      />
    </div>
  );
}
