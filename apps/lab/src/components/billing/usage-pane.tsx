import Link from "next/link";
import { Download } from "lucide-react";
import { PaneHeader } from "@/components/pane-header";
import { Button } from "@/ui/button";
import { transactions } from "@/mocks/billing";
import { BILLING_COPY } from "./constants";
import { UsageTransactionRow } from "./usage-transaction-row";

export function UsagePane() {
  return (
    <div>
      <PaneHeader
        title={BILLING_COPY.usage.title}
        description={BILLING_COPY.usage.description}
        action={
          <Button variant="quiet" className="shrink-0 border-white/8">
            <Download className="size-3" />
            {BILLING_COPY.receipts.download}
          </Button>
        }
      />

      <div className="p-5">
        <div className="min-w-0 rounded-xl border border-white/8 bg-white/1.5">
          <div className="divide-y divide-white/5.5">
            {transactions.map((transaction) => (
              <UsageTransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
          <div className="border-t border-white/6 p-3 text-center">
            <Link
              href="/help"
              className="text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {BILLING_COPY.receipts.history}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
