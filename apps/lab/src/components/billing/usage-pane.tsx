import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/ui/button";
import { BILLING_COPY, BILLING_TRANSACTIONS } from "./constants";
import { UsageTransactionRow } from "./usage-transaction-row";

export function UsagePane() {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 border-b border-white/6 px-5 py-4">
        <div>
          <h2 className="text-sm lg:text-xs font-medium">{BILLING_COPY.usage.title}</h2>
          <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">{BILLING_COPY.usage.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 rounded-lg border border-white/8 px-2.5 text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/4 hover:text-foreground"
        >
          <Download className="size-3" />
          {BILLING_COPY.receipts.download}
        </Button>
      </div>

      <div className="p-5">
        <div className="min-w-0 rounded-xl border border-white/8 bg-white/1.5">
          <div className="divide-y divide-white/5.5">
            {BILLING_TRANSACTIONS.map((transaction) => (
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
