import { Link } from "@/components/link";
import { Coins, LogOut, Plus } from "lucide-react";
import { cn } from "cn";
import { formatUSD } from "@/components/pricing/utils";
import { balance } from "@/mocks/billing";
import { ACCOUNT_LINKS, ACCOUNT_MENU_COPY, ACCOUNT_PANE_ITEM_CLASS } from "./constants";
import type { SidebarInlinePaneProps } from "./types";

export function SidebarInlinePane({ pending, onNavigate, onSignOut }: SidebarInlinePaneProps) {
  return (
    <div className="absolute inset-x-0 bottom-full z-20 mb-1.5 flex flex-col gap-0.5 rounded-lg border border-white/8 bg-[#17191c] p-1.5 shadow-[0_1.25rem_3rem_-0.75rem_rgba(0,0,0,0.85)]">
      <Link href="/settings/billing" onClick={onNavigate} className={ACCOUNT_PANE_ITEM_CLASS}>
        <Coins className="size-3.5" />
        {ACCOUNT_MENU_COPY.balance}
        <span className="ml-auto text-xs font-normal text-foreground tabular-nums lg:text-[0.6875rem]">
          {formatUSD(balance)}
        </span>
        <Plus className="size-3.5" />
      </Link>
      {ACCOUNT_LINKS.map((item) => (
        <Link key={item.label} href={item.href} onClick={onNavigate} className={ACCOUNT_PANE_ITEM_CLASS}>
          <item.icon className="size-3.5" />
          {item.label}
        </Link>
      ))}
      <button
        type="button"
        disabled={pending}
        onClick={onSignOut}
        className={cn(ACCOUNT_PANE_ITEM_CLASS, "disabled:opacity-50")}
      >
        <LogOut className="size-3.5" />
        {ACCOUNT_MENU_COPY.signOut}
      </button>
    </div>
  );
}
