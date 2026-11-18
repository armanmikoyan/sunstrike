import { cn } from "cn";
import { IconBox } from "@/ui/icon-box";
import type { UsageTransactionRowProps } from "./types";

export function UsageTransactionRow({ transaction }: UsageTransactionRowProps) {
  const Icon = transaction.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/1.5">
      <IconBox>
        <Icon className="size-3.5" strokeWidth={1.7} />
      </IconBox>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs lg:text-[0.6875rem] font-medium">{transaction.title}</p>
        <p className="mt-0.5 truncate text-xs lg:text-[0.6875rem] text-muted-foreground">{transaction.detail}</p>
      </div>
      <div className="hidden w-24 shrink-0 text-right sm:block">
        <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{transaction.date}</p>
      </div>
      <div className="w-16 shrink-0 text-right">
        <p
          className={cn(
            "font-mono text-xs lg:text-[0.6875rem]",
            transaction.amount.startsWith("+") ? "text-foreground" : "text-foreground/75",
          )}
        >
          <span className="tabular-nums font-normal">{transaction.amount}</span>
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs lg:text-[0.6875rem]",
            transaction.status === "Refunded" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {transaction.status}
        </p>
      </div>
    </div>
  );
}
