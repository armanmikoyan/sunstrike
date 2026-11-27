"use client";

import { Link } from "@/components/link";
import { Bell, Check } from "lucide-react";
import { Button } from "@/ui/button";
import { NOTIFICATION_TYPE_LABELS } from "@/components/nav/constants";
import { notifications, unreadNotifications } from "@/mocks/notifications";
import { cn } from "cn";
import { NOTIFICATIONS_COPY } from "./constants";
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
          className="relative size-8 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label={NOTIFICATIONS_COPY.label}
        >
          <Bell className="size-4.25" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-1">
        <DropdownMenuLabel className="flex items-center justify-between">
          {NOTIFICATIONS_COPY.label}
          <span className="font-normal text-foreground">{unreadNotifications.length} new</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((item) => (
          <DropdownMenuItem key={item.id} asChild>
            <Link href="/library" className="items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/5",
                  item.readAt ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {item.readAt ? <Check className="size-3.5" /> : <Bell className="size-3.5" />}
              </span>
              <span>
                <span className="block font-medium">{NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}</span>
                <span className="mt-0.5 block font-mono text-muted-foreground">{item.generationId}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
