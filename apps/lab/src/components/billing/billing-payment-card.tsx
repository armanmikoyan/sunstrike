import { ArrowRight, CreditCard } from "lucide-react";
import { IconBox } from "@/ui/icon-box";
import { BILLING_COPY } from "./constants";

export function BillingPaymentCard() {
  return (
    <div className="rounded-xl border border-white/8 bg-white/1.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconBox>
            <CreditCard className="size-3.5" strokeWidth={1.8} />
          </IconBox>
          <div>
            <p className="text-xs lg:text-[0.6875rem] font-medium">{BILLING_COPY.payment.title}</p>
            <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
              {BILLING_COPY.payment.description}
            </p>
          </div>
        </div>
        <span className="text-xs lg:text-[0.6875rem] text-muted-foreground">{BILLING_COPY.payment.network}</span>
      </div>
      <div className="mt-4 rounded-lg border border-white/6 bg-black/15 p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded bg-white text-xs lg:text-[0.6875rem] font-semibold text-[#1a1f71]">
            {BILLING_COPY.payment.badge}
          </span>
          <div>
            <p className="font-mono text-xs lg:text-[0.6875rem]">{BILLING_COPY.payment.card}</p>
            <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">{BILLING_COPY.payment.expiry}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
      >
        {BILLING_COPY.payment.manage}
        <ArrowRight className="size-2.5" />
      </button>
    </div>
  );
}
