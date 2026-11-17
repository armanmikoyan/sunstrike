import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { billingCopy, billingTransactions } from "./constants";

export function UsagePane() {
  const { receipts, usage } = billingCopy;

  return (
    <div>
      <div className="flex items-start justify-between gap-3 border-b border-white/6 px-5 py-4">
        <div>
          <h2 className="text-sm lg:text-[0.75rem] font-medium">{usage.title}</h2>
          <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">{usage.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 rounded-lg border border-white/8 px-2.5 text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/4 hover:text-foreground"
        >
          <Download className="size-3" />
          {receipts.download}
        </Button>
      </div>

      <div className="p-5">
        <div className="min-w-0 rounded-xl border border-white/8 bg-white/1.5">
          <div className="divide-y divide-white/5.5">
            {billingTransactions.map((txn) => {
              const Icon = txn.icon;
              return (
                <div key={txn.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/1.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/7 bg-white/2.5 text-muted-foreground">
                    <Icon className="size-3.5" strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs lg:text-[0.6875rem] font-medium">{txn.title}</p>
                    <p className="mt-0.5 truncate text-xs lg:text-[0.6875rem] text-muted-foreground">{txn.detail}</p>
                  </div>
                  <div className="hidden w-24 shrink-0 text-right sm:block">
                    <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{txn.date}</p>
                  </div>
                  <div className="w-16 shrink-0 text-right">
                    <p
                      className={cn(
                        "font-mono text-xs lg:text-[0.6875rem]",
                        txn.amount.startsWith("+") ? "text-foreground" : "text-foreground/75",
                      )}
                    >
                      <span className="tabular-nums font-normal">{txn.amount}</span>
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs lg:text-[0.6875rem]",
                        txn.status === "Refunded" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {txn.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/6 p-3 text-center">
            <Link
              href="/help"
              className="text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {receipts.history}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
