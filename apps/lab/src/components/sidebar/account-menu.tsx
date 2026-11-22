import Link from "next/link";
import { Coins, LogOut, Plus } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/ui/dropdown-menu";
import { ACCOUNT, ACCOUNT_LINKS, ACCOUNT_MENU_COPY } from "./constants";
import type { AccountMenuProps } from "./types";

export function AccountMenu({
  side,
  align,
  email,
  onSignOut,
  onPointerEnter,
  onPointerLeave,
  pending,
}: AccountMenuProps) {
  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={8}
      className="w-60 p-1"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <DropdownMenuLabel className="h-9">
        <span className="block font-medium text-foreground">{ACCOUNT_MENU_COPY.account}</span>
        <span className="mt-0.5 block font-normal text-muted-foreground">{email ?? ACCOUNT_MENU_COPY.signedOut}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/settings/billing">
          <Coins className="size-4 text-muted-foreground" />
          <span className="flex-1">{ACCOUNT_MENU_COPY.balance}</span>
          <span className="tabular-nums font-normal text-foreground">{ACCOUNT.balance}</span>
          <Plus className="size-3.5 text-muted-foreground" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {ACCOUNT_LINKS.map((item) => (
        <DropdownMenuItem key={item.label} asChild>
          <Link href={item.href}>
            <item.icon className="size-4 text-muted-foreground" />
            {item.label}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={pending} onSelect={() => onSignOut()}>
        <LogOut className="size-4 text-muted-foreground" />
        {ACCOUNT_MENU_COPY.signOut}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
