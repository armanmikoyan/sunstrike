import { AutoTopUpCard } from "@/components/auto-top-up-card";
import { BillingBalanceCard } from "./billing-balance-card";
import { BillingFooter } from "./billing-footer";
import { BillingHeader } from "./billing-header";
import { BillingLowBalanceCard } from "./billing-low-balance-card";
import { BillingPaymentCard } from "./billing-payment-card";

export function BillingPane() {
  return (
    <div>
      <BillingHeader />

      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <BillingBalanceCard />
          <AutoTopUpCard />
          <BillingPaymentCard />
          <BillingLowBalanceCard />
        </div>

        <BillingFooter />
      </div>
    </div>
  );
}
