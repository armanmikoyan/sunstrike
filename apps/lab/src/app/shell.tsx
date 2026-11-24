"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/sidebar/mobile-sidebar";
import { TopNav } from "@/components/nav";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-480">
        <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded((value) => !value)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav onOpenMenu={() => setMobileNavOpen(true)} menuButtonRef={menuButtonRef} />
          {children}
        </div>
      </div>
      <MobileSidebar open={mobileNavOpen} onOpenChange={setMobileNavOpen} returnFocusRef={menuButtonRef} />
    </div>
  );
}
