"use client";

import Link from "next/link";
import { Bell, CreditCard, Film, Layers3 } from "lucide-react";
import { Button } from "@/ui/button";
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
            {notificationsCopy.unread}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificationsCopy.items.map((item, index) => {
          const Icon = [Film, CreditCard, Layers3][index];
          return (
            <DropdownMenuItem
              key={item.title}
              className="items-start gap-2.5 p-2"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05]",
                  index === 0 ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <span>
                <span className="block text-[0.75rem] font-medium">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
                  {item.detail}
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-[0.6875rem] text-muted-foreground">
          <Link href="/library">{notificationsCopy.viewAll}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
