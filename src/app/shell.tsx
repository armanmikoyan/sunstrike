"use client";

import { useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { atom, useAtom } from "jotai";
import { MobileSidebar, Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/nav";

/**
 * Mounted once in the root layout, so the rail has a single owner and its
 * state survives navigation between the `(website)` and `(workspace)` trees.
 */
const railExpandedAtom = atom(false);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useAtom(railExpandedAtom);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  if (pathname === "/login") return <>{children}</>;

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
