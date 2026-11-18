import Link from "next/link";
import { Coins } from "lucide-react";
import { Button } from "@/ui/button";
import { BILLING_COPY } from "./constants";

export function BillingLowBalanceCard() {
  return (
    <div className="flex flex-col rounded-xl border border-white/8 glass-card p-4">
      <Coins className="size-3.5 text-muted-foreground" />
      <p className="mt-3 text-xs lg:text-[0.6875rem] font-medium">{BILLING_COPY.low.title}</p>
      <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
        {BILLING_COPY.low.description}
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-3 h-8 w-full rounded-lg border-white/10 bg-transparent text-xs lg:text-[0.6875rem] hover:bg-white/4"
      >
        <Link href="/pricing">{BILLING_COPY.low.action}</Link>
      </Button>
    </div>
  );
}
