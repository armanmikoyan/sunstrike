"use client";

import { cn } from "cn";
import { PRIMARY_LINKS, SECONDARY_LINKS, SIDEBAR_COPY } from "./constants";
import { useIsActive } from "./hooks";
import { SidebarAccountTrigger } from "./sidebar-account-trigger";
import { SidebarInlineAccount } from "./sidebar-inline-account";
import { SidebarLinks } from "./sidebar-links";
import { SidebarNewGeneration } from "./sidebar-new-generation";
import type { SidebarBodyProps } from "./types";

export function SidebarBody({ expanded, showToggle = true, onNavigate, inlineAccount = false }: SidebarBodyProps) {
  const isActive = useIsActive();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center">
      <SidebarNewGeneration expanded={expanded} showToggle={showToggle} onNavigate={onNavigate} />

      <nav aria-label={SIDEBAR_COPY.studio} className="flex w-full shrink-0 flex-col gap-1.5">
        <SidebarLinks
          links={PRIMARY_LINKS}
          expanded={expanded}
          rail={showToggle}
          isActive={isActive}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-1.5 pt-4">
        <SidebarLinks
          links={SECONDARY_LINKS}
          expanded={expanded}
          rail={showToggle}
          isActive={isActive}
          onNavigate={onNavigate}
        />

        <div
          className={cn(
            "my-2 h-px w-full max-w-9 self-start bg-border transition-[max-width] duration-260 motion-reduce:transition-none",
            expanded ? (showToggle ? "max-w-45" : "max-w-full") : "max-w-9",
          )}
        />

        {expanded && inlineAccount ? (
          <SidebarInlineAccount onNavigate={onNavigate} />
        ) : (
          <SidebarAccountTrigger expanded={expanded} showToggle={showToggle} />
        )}
      </div>
    </div>
  );
}
