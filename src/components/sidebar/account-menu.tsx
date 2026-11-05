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
      className="w-60 p-1.5"
    >
      <DropdownMenuLabel className="px-2 py-2">
        <span className="block text-[0.75rem] font-medium text-foreground">
          {ACCOUNT.name}
        </span>
        <span className="mt-0.5 block text-[0.6875rem] font-normal text-muted-foreground">
          {ACCOUNT.email}
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="p-2">
        <Link href="/pricing">
          <Coins className="size-4 text-muted-foreground" />
          <span className="flex-1">{accountMenuCopy.balance}</span>
          <span className="font-mono text-[0.6875rem] tabular-nums text-foreground">
            {ACCOUNT.balance}
          </span>
          <Plus className="size-3.5 text-muted-foreground" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {accountLinks.map((item) => (
        <DropdownMenuItem key={item.label} asChild className="p-2">
          <Link href={item.href}>
            <item.icon className="size-4 text-muted-foreground" />
            {item.label}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="p-2">
        <Link href="/login">
          <LogOut className="size-4 text-muted-foreground" />
          {accountMenuCopy.signOut}
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
