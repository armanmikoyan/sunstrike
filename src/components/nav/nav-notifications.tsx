"use client";

import Link from "next/link";
import { Bell, CreditCard, Film, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavNotifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-[1.0625rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-1.5">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          Notifications
          <span className="text-[0.6875rem] font-normal text-foreground">
            3 new
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="items-start gap-2.5 p-2">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05] text-foreground">
            <Film className="size-3.5" />
          </span>
          <span>
            <span className="block text-[0.75rem] font-medium">
              Your render is ready
            </span>
            <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
              After Rain · 6 seconds · 1080p
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="items-start gap-2.5 p-2">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05] text-muted-foreground">
            <CreditCard className="size-3.5" />
          </span>
          <span>
            <span className="block text-[0.75rem] font-medium">
              Balance added
            </span>
            <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
              $10.00 from your top-up
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="items-start gap-2.5 p-2">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.05] text-muted-foreground">
            <Layers3 className="size-3.5" />
          </span>
          <span>
            <span className="block text-[0.75rem] font-medium">
              New: Chronolab Motion 2
            </span>
            <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
              Better faces, longer shots.
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-[0.6875rem] text-muted-foreground">
          <Link href="/library">View all activity</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
