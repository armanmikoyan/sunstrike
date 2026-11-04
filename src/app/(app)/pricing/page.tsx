import Link from "next/link";
import {
  ArrowRight,
  Check,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PricingOrderTabs } from "@/components/pricing";
import { ClipStrip } from "@/components/clip-strip";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { generationRates, topUpPacks } from "@/lib/media";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pricing",
};

const faqs = [
  {
    question: "How does billing work?",
    answer:
      "Pay as you go in US dollars. Add funds whenever you need them, and every render is charged at the price shown in the composer before you start.",
  },
  {
    question: "Is there a subscription?",
    answer:
      "No. Chronolab is pay as you go. Top up when you need to and spend the balance across image and video models at your own pace.",
  },
  {
    question: "Does my balance expire?",
    answer:
      "No. Your balance stays in your studio account until you use it. Auto top-up is optional and can be switched off at any time.",
  },
  {
    question: "What happens if a render fails?",
    answer:
      "The amount is held when a job starts and only charged when it completes. Failed renders are refunded automatically.",
  },
  {
    question: "Can I use the work commercially?",
    answer:
      "Yes. Every output you generate on a paid plan comes with a commercial license. Teams can add a shared workspace from the billing page.",
  },
];

export default function PricingPage() {
  return (
    <>
      <div className="w-full px-5 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_22.5rem]">
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-[0.75rem] text-muted-foreground">
                Pay as you go
              </div>
              <h1 className="mt-4 max-w-[43.75rem] text-balance text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.02] tracking-[-0.05em]">
                Pay for output
                <br />
                <span className="font-display font-normal tracking-[-0.03em]">
                  Not seats
                </span>
              </h1>
              <p className="mt-4 max-w-[31.875rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                One balance for stills and motion — clips from{" "}
                <span className="text-foreground">$0.34</span>, stills from{" "}
                <span className="text-foreground">$0.07</span>. Top up from $10,
                see the exact cost of every render before you start, and keep
                what you don&apos;t spend.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {["No monthly fee", "Balance never expires", "Commercial use"].map(
                  (item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground"
                    >
                      <Check className="size-3.5 text-muted-foreground" />
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <ClipStrip
              ids={["01", "02", "03", "04", "07", "08"]}
              className="hidden min-h-[12.5rem] flex-1 lg:flex"
            />
          </div>

          <PricingOrderTabs />
        </div>

        <div className="mt-16">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-[1.375rem] font-medium tracking-[-0.025em]">
                Top-ups
              </h2>
              <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                Buy any amount from $10. One-time payment, no recurring charge.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              Secure checkout · instant delivery
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {topUpPacks.map((pack) => (
              <div
                key={pack.id}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-xl border p-5",
                  pack.popular
                    ? "border-white/[0.16] bg-white/[0.03]"
                    : "border-white/[0.08] bg-white/[0.015]",
                )}
              >
                {pack.popular ? (
                  <span className="absolute right-5 top-5 text-[0.6875rem] font-medium text-foreground">
                    Most popular
                  </span>
                ) : null}
                <p className="text-[0.75rem] font-medium text-muted-foreground">
                  {pack.name}
                </p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-[2.25rem] font-medium leading-none tracking-[-0.03em] tabular-nums">
                    ${pack.price}
                  </span>
                  <span className="mb-1 text-[0.75rem] text-muted-foreground">
                    one time
                  </span>
                </div>
                <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                  {pack.note}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[0.6875rem] text-muted-foreground">
                  <span>Added to your balance</span>
                  <span>Never expires</span>
                </div>
                <Button
                  asChild
                  variant={pack.popular ? "default" : "outline"}
                  className={cn(
                    "mt-5 h-10 rounded-lg text-[0.75rem] font-medium",
                    pack.popular
                      ? "bg-brand text-brand-foreground hover:bg-brand-hover"
                      : "border-white/10 bg-transparent text-foreground hover:bg-white/[0.04]",
                  )}
                >
                  <Link href="/billing">
                    Top up ${pack.price}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_21.25rem]">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.012]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <h2 className="text-[0.9375rem] font-medium">What a render costs</h2>
                <p className="mt-1 text-[0.75rem] text-muted-foreground">
                  Exact price per render, before you hit generate.
                </p>
              </div>
              <Zap className="size-4 text-muted-foreground" />
            </div>
            <div className="divide-y divide-white/[0.055]">
              {generationRates.map((rate) => (
                <div
                  key={rate.name}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-medium">{rate.name}</p>
                    <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                      {rate.detail}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-2">
                    <span className="font-mono text-[0.9375rem] font-medium text-foreground">
                      {rate.price}
                    </span>
                    <span className="hidden text-[0.6875rem] text-muted-foreground min-[22.5rem]:inline">
                      per render
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.015] px-5 py-3">
              <p className="text-[0.6875rem] text-muted-foreground">
                Failed renders are refunded automatically.
              </p>
              <Link
                href="/create/video"
                className="flex items-center gap-1 text-[0.6875rem] font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Start a render
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#18191c] p-5">
            <RefreshCw className="size-4 text-muted-foreground" />
            <h3 className="mt-4 text-[0.9375rem] font-medium">
              Auto top-up, on your terms
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Set a floor and a pack size. Chronolab refills your balance only when
              it drops below your threshold. Switch it off whenever you want.
            </p>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span className="text-[0.75rem] text-muted-foreground">
                  Balance below
                </span>
                <span className="font-mono text-[0.6875rem]">$5</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span className="text-[0.75rem] text-muted-foreground">
                  Top up with
                </span>
                <span className="font-mono text-[0.6875rem]">$10</span>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-4 h-9 w-full rounded-lg border-white/10 bg-transparent text-[0.75rem] text-foreground hover:bg-white/[0.04]"
            >
              <Link href="/billing">
                Configure auto top-up
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <h2 className="text-[1.375rem] font-medium tracking-[-0.025em]">
            Common questions
          </h2>
          <div className="mt-4 grid gap-x-12 md:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-white/[0.07] py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-[0.8125rem] font-medium">
                  {faq.question}
                  <span className="relative size-3">
                    <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-muted-foreground" />
                    <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-muted-foreground transition-transform group-open:rotate-90" />
                  </span>
                </summary>
                <p className="mt-2 max-w-[30rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
