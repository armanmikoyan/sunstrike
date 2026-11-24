import { Coins } from "lucide-react";
import { formatUSD } from "@/components/pricing/utils";
import { balance } from "@/mocks/billing";
import { BILLING_COPY } from "./constants";

export function BillingBalanceCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/1.5 p-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
            <Coins className="size-3 text-muted-foreground" />
            {BILLING_COPY.balance.label}
          </span>
          <span className="font-mono text-xs lg:text-[0.6875rem] text-muted-foreground">
            {BILLING_COPY.balance.tag}
          </span>
        </div>
        <span className="tabular-nums font-normal mt-4 block text-[2rem] leading-none tracking-[-0.03em]">
          {formatUSD(balance)}
        </span>
        <div className="mt-3 flex items-center justify-between text-xs lg:text-[0.6875rem]">
          <span className="text-muted-foreground">{BILLING_COPY.balance.currency}</span>
          <span className="text-muted-foreground">{BILLING_COPY.balance.note}</span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/30">
          <div className="h-full w-[37%] rounded-full bg-foreground/80" />
        </div>
      </div>
    </div>
  );
}
