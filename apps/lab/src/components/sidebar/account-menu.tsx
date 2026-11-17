import Link from "next/link";
import { Coins, LogOut, Plus } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/ui/dropdown-menu";
import { ACCOUNT, accountLinks, accountMenuCopy } from "./constants";
import type { AccountMenuProps } from "./types";

export function AccountMenu({ side, align }: AccountMenuProps) {
  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={8}
      className="w-60 p-1"
    >
      <DropdownMenuLabel className="h-9 px-2">
        <span className="block text-xs lg:text-[0.6875rem] font-medium text-foreground">
          {accountMenuCopy.account}
        </span>
        <span className="mt-0.5 block text-xs lg:text-[0.6875rem] font-normal text-muted-foreground">
          {ACCOUNT.email}
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="h-9 px-2">
        <Link href="/settings/billing">
          <Coins className="size-4 text-muted-foreground" />
          <span className="flex-1">{accountMenuCopy.balance}</span>
          <span className="tabular-nums font-normal text-xs lg:text-[0.6875rem] text-foreground">
            {ACCOUNT.balance}
          </span>
          <Plus className="size-3.5 text-muted-foreground" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {accountLinks.map((item) => (
        <DropdownMenuItem key={item.label} asChild className="h-9 px-2">
          <Link href={item.href}>
            <item.icon className="size-4 text-muted-foreground" />
            {item.label}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="h-9 px-2">
        <Link href="/login">
          <LogOut className="size-4 text-muted-foreground" />
          {accountMenuCopy.signOut}
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
