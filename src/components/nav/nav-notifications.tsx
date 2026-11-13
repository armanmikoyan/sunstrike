"use client";

import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { Button } from "@/ui/button";
import { notificationTypeLabels } from "@/lib/notifications";
import { notifications, unreadNotifications } from "@/mocks/notifications";
import { cn } from "@/lib/utils";
import { notificationsCopy } from "./constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

export function NavNotifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          aria-label={notificationsCopy.label}
        >
          <Bell className="size-[1.0625rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-1.5">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          {notificationsCopy.label}
          <span className="text-[0.6875rem] font-normal text-foreground">
            {unreadNotifications.length} new
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((item) => (
          <DropdownMenuItem key={item.id} asChild className="p-2">
            <Link href="/library" className="items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05]",
                  item.readAt ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {item.readAt ? (
                  <Check className="size-3.5" />
                ) : (
                  <Bell className="size-3.5" />
                )}
              </span>
              <span>
                <span className="block text-[0.75rem] font-medium">
                  {notificationTypeLabels[item.type] ?? item.type}
                </span>
                <span className="mt-0.5 block font-mono text-[0.6875rem] text-muted-foreground">
                  {item.generationId}
                </span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
