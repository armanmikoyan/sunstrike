import Link from "next/link";
import { Coins, Plus } from "lucide-react";
import { formatUSD } from "@/components/pricing/utils";
import { balance } from "@/mocks/billing";

export function NavBalance() {
  return (
    <Link
      href="/settings/billing"
      className="group flex h-8 items-center gap-2 rounded-lg border border-white/8 bg-white/3.5 px-2 transition-colors hover:border-white/20 hover:bg-white/6"
    >
      <Coins className="hidden size-3.5 text-muted-foreground sm:block" />
      <span className="tabular-nums font-normal text-sm lg:text-xs">{formatUSD(balance)}</span>
      <span className="hidden text-xs lg:text-[0.6875rem] text-muted-foreground lg:inline">balance</span>
      <span className="mx-0.5 hidden h-3.5 w-px bg-white/10 sm:block" />
      <Plus className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground lg:size-3" />
    </Link>
  );
}
