"use client";

import { useRef, useState } from "react";
import { MobileSidebar, Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
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
          <main className="min-h-[calc(100svh-3rem)] flex-1">{children}</main>
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
