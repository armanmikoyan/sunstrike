import Link from "next/link";
import {
  ArrowRight,
  Coins,
  CreditCard,
  Download,
  Plus,
  ReceiptText,
} from "lucide-react";
import { AutoTopUpCard } from "@/components/auto-top-up-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import {
  billingCopy,
  billingTransactions,
  billingUsage,
} from "./constants";

export function Billing() {
  const { balance, payment, receipts, usage, low, footer } = billingCopy;

  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow={billingCopy.eyebrow}
          title={billingCopy.title}
          description={billingCopy.description}
          action={
            <Button
              asChild
              className="h-9 rounded-lg bg-brand px-3.5 text-[0.6875rem] font-medium text-brand-foreground hover:bg-brand-hover"
            >
              <Link href="/pricing">
                <Plus className="size-3.5" />
                {billingCopy.addFunds}
              </Link>
            </Button>
          }
        />

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-white/[0.1] bg-white/[0.015] p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                  <Coins className="size-3 text-muted-foreground" />
                  {balance.label}
                </span>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {balance.tag}
                </span>
              </div>
              <p className="mt-4 text-[2.25rem] font-medium leading-none tracking-[-0.03em] tabular-nums">
                {balance.value}
              </p>
              <div className="mt-3 flex items-center justify-between text-[0.6875rem]">
                <span className="text-muted-foreground">{balance.currency}</span>
                <span className="text-muted-foreground">{balance.note}</span>
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/30">
                <div className="h-full w-[37%] rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>

          <AutoTopUpCard />

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-muted-foreground">
                  <CreditCard className="size-3.5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[0.6875rem] font-medium">
                    {payment.title}
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {payment.description}
                  </p>
                </div>
              </div>
              <span className="text-[0.6875rem] text-muted-foreground">
                {payment.network}
              </span>
            </div>
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/15 p-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded bg-white text-[0.6875rem] font-semibold text-[#1a1f71]">
                  {payment.badge}
                </span>
                <div>
                  <p className="font-mono text-[0.6875rem]">{payment.card}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {payment.expiry}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {payment.manage}
              <ArrowRight className="size-2.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_20.625rem]">
          <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.015]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-3.5 text-muted-foreground" />
                <p className="text-[0.6875rem] font-medium">
                  {receipts.title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 rounded-md px-2 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              >
                <Download className="size-3" />
                {receipts.download}
              </Button>
            </div>

            <div className="divide-y divide-white/[0.055]">
              {billingTransactions.map((txn) => {
                const Icon = txn.icon;
                return (
                  <div
                    key={txn.id}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.015]"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-muted-foreground">
                      <Icon className="size-3.5" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.6875rem] font-medium">
                        {txn.title}
                      </p>
                      <p className="mt-0.5 truncate text-[0.6875rem] text-muted-foreground">
                        {txn.detail}
                      </p>
                    </div>
                    <div className="hidden w-24 shrink-0 text-right sm:block">
                      <p className="text-[0.6875rem] text-muted-foreground">
                        {txn.date}
                      </p>
                    </div>
                    <div className="w-16 shrink-0 text-right">
                      <p
                        className={cn(
                          "font-mono text-[0.6875rem]",
                          txn.amount.startsWith("+")
                            ? "text-foreground"
                            : "text-foreground/75",
                        )}
                      >
                        {txn.amount}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[0.6875rem]",
                          txn.status === "Refunded"
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {txn.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/[0.06] p-3 text-center">
              <Link
                href="/help"
                className="text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {receipts.history}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] font-medium">{usage.title}</p>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {usage.total}
                </span>
              </div>
              <div className="mt-5 flex h-24 items-end gap-1">
                {billingUsage.map((height, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 rounded-sm",
                      height === Math.max(...billingUsage)
                        ? "bg-foreground"
                        : "bg-white/[0.12]",
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground">
                <span>{usage.start}</span>
                <span>{usage.end}</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] glass-card p-4">
              <Coins className="size-3.5 text-muted-foreground" />
              <p className="mt-3 text-[0.75rem] font-medium">{low.title}</p>
              <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                {low.description}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-3 h-8 w-full rounded-lg border-white/10 bg-transparent text-[0.6875rem] hover:bg-white/[0.04]"
              >
                <Link href="/pricing">{low.action}</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-[0.6875rem] text-muted-foreground">
            {footer.note}
          </p>
          <div className="flex items-center gap-4 text-[0.6875rem]">
            <Link
              href="/help"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {footer.help}
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground"
            >
              {footer.tax}
              <ArrowRight className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
