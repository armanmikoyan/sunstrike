import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  Coins,
  CreditCard,
  Download,
  Film,
  Image as ImageIcon,
  Plus,
  ReceiptText,
} from "lucide-react";
import { AutoTopUpCard } from "@/components/shared/auto-top-up-card";
import { PageHeader } from "@/components/shared/page-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Billing",
};

const transactions = [
  {
    id: "txn_20931",
    title: "Sunstrike Motion 2 · After Rain",
    detail: "Video render · 6s · 1080p",
    date: "Today, 14:32",
    amount: "−$0.51",
    status: "Completed",
    icon: Film,
  },
  {
    id: "txn_20930",
    title: "Sunstrike Image Pro · Soft Object",
    detail: "Image render · 2 MP",
    date: "Today, 14:08",
    amount: "−$0.12",
    status: "Completed",
    icon: ImageIcon,
  },
  {
    id: "txn_20929",
    title: "Balance top-up",
    detail: "Studio pack · Visa ending 4242",
    date: "Oct 27, 09:12",
    amount: "+$25.00",
    status: "Paid",
    icon: Coins,
  },
  {
    id: "txn_20928",
    title: "Sunstrike Motion Turbo · Orbit study",
    detail: "Video render · 4s · 720p",
    date: "Oct 27, 08:44",
    amount: "−$0.34",
    status: "Completed",
    icon: Film,
  },
  {
    id: "txn_20927",
    title: "Failed render refund",
    detail: "Sunstrike Motion 2 · automatic refund",
    date: "Oct 26, 19:03",
    amount: "+$0.51",
    status: "Refunded",
    icon: ArrowDownToLine,
  },
  {
    id: "txn_20926",
    title: "Balance top-up",
    detail: "Starter pack · Visa ending 4242",
    date: "Oct 18, 12:21",
    amount: "+$10.00",
    status: "Paid",
    icon: Coins,
  },
];

const usage = [22, 38, 30, 58, 46, 72, 34, 55, 88, 62, 40, 76, 48, 64];

export default function BillingPage() {
  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow="Account"
          title="Billing"
          description="One balance for every model. No subscription, no expiry, no seat minimum."
          action={
            <Button
              asChild
              className="h-9 rounded-lg bg-brand px-3.5 text-[11px] font-medium text-brand-foreground hover:bg-brand-hover"
            >
              <Link href="/pricing">
                <Plus className="size-3.5" />
                Add funds
              </Link>
            </Button>
          }
        />

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-white/[0.1] bg-white/[0.02] p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Coins className="size-3 text-muted-foreground" />
                  Available balance
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  PAYG
                </span>
              </div>
              <p className="mt-4 text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                $10.54
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">USD</span>
                <span className="text-muted-foreground">Never expires</span>
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
                  <p className="text-[11px] font-medium">Payment method</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Charged when you add funds
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">Visa</span>
            </div>
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/15 p-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded bg-white text-[11px] font-semibold text-[#1a1f71]">
                  VISA
                </span>
                <div>
                  <p className="font-mono text-[11px]">•••• 4242</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Expires 08/29
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Manage payment methods
              <ArrowRight className="size-2.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.012]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-3.5 text-muted-foreground" />
                <p className="text-[11px] font-medium">Usage & receipts</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 rounded-md px-2 text-[11px] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              >
                <Download className="size-3" />
                Download all
              </Button>
            </div>

            <div className="divide-y divide-white/[0.055]">
              {transactions.map((txn) => {
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
                      <p className="truncate text-[11px] font-medium">
                        {txn.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {txn.detail}
                      </p>
                    </div>
                    <div className="hidden w-24 shrink-0 text-right sm:block">
                      <p className="text-[11px] text-muted-foreground">
                        {txn.date}
                      </p>
                    </div>
                    <div className="w-16 shrink-0 text-right">
                      <p
                        className={cn(
                          "font-mono text-[11px]",
                          txn.amount.startsWith("+")
                            ? "text-foreground"
                            : "text-foreground/75",
                        )}
                      >
                        {txn.amount}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[11px]",
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
                className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                View full transaction history
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium">Last 14 days</p>
                <span className="font-mono text-[11px] text-muted-foreground">
                  $12.40
                </span>
              </div>
              <div className="mt-5 flex h-24 items-end gap-1">
                {usage.map((height, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 rounded-sm",
                      height === Math.max(...usage)
                        ? "bg-foreground"
                        : "bg-white/[0.12]",
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Oct 18</span>
                <span>Oct 31</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#18191c] p-4">
              <Coins className="size-3.5 text-muted-foreground" />
              <p className="mt-3 text-[12px] font-medium">Running low?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Auto top-up keeps your balance above $5. You can switch
                it off from this page at any time.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-3 h-8 w-full rounded-lg border-white/10 bg-transparent text-[11px] hover:bg-white/[0.04]"
              >
                <Link href="/pricing">See top-up options</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.012] px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-[11px] text-muted-foreground">
            All prices in USD. Your next charge is only when you top up.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/help"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Billing help
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground"
            >
              Tax information
              <ArrowRight className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
