"use client";

import { Link } from "@/components/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { SETTINGS_NAV } from "./constants";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className="-mx-0.5 flex gap-0.5 overflow-x-auto px-0.5 py-0.5 lg:sticky lg:top-14 lg:m-0 lg:flex-col lg:gap-1 lg:self-start lg:overflow-visible lg:p-0"
    >
      {SETTINGS_NAV.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/3.5 hover:text-foreground lg:gap-2 lg:px-2.5 lg:text-[0.6875rem]",
              active && "bg-white/5.5 text-foreground",
            )}
          >
            <Icon className={cn("size-3.5", active && "text-foreground")} strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
