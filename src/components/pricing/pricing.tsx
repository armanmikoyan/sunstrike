import Link from "next/link";
import { ArrowRight, Check, Film, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/ui/button";
import { imageRates, topUpPacks, videoRates } from "@/mocks/pricing";
import { cn } from "@/lib/utils";
import { pricingCopy, pricingPoints } from "./constants";
import { PricingCustomTopUp } from "./pricing-custom-top-up";
import { PricingFaq } from "./pricing-faq";
import { PricingModelRates } from "./pricing-model-rates";

export function Pricing() {
  const { hero, topUps, faq } = pricingCopy;
  const motion = videoRates.find(
    (model) => model.slug === "chronolab-motion-2",
  ) ?? videoRates[0];
  const image = imageRates.find(
    (model) => model.slug === "chronolab-image-2",
  ) ?? imageRates[0];

  return (
    <div className="w-full px-5 py-8 sm:py-10">
      <section className="flex flex-col justify-between gap-8 border-b border-border pb-8 lg:flex-row lg:items-end">
        <div className="max-w-[48rem]">
          <p className="text-[0.75rem] text-muted-foreground">{hero.eyebrow}</p>
          <h1 className="mt-3 text-balance font-grotesk text-[2.25rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[2.75rem]">
            {hero.titleBefore}
            <span className="font-serif font-normal italic text-brand">
              {hero.titleAccent}
            </span>
            {hero.titleAfter}
          </h1>
          <p className="mt-4 max-w-[36rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
            {hero.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {pricingPoints.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground"
              >
                <Check className="size-3.5 text-muted-foreground" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            asChild
            className="h-10 rounded-lg bg-brand px-4 text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
          >
            <Link href="/create/video">
              {hero.primaryAction}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-lg border-white/10 bg-transparent px-4 text-[0.75rem] text-foreground hover:bg-white/[0.04]"
          >
            <a href="#model-rates">{hero.secondaryAction}</a>
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader
          title={topUps.title}
          description={topUps.description}
          action={
            <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              {topUps.secure}
            </span>
          }
        />

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {topUpPacks.map((pack) => {
            const seconds = Math.floor(pack.price / motion.perSecond);
            const images = Math.floor(pack.price / image.perImage);

            return (
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
                    {topUps.popular}
                  </span>
                ) : null}
                <p className="text-[0.75rem] font-medium text-muted-foreground">
                  {pack.name}
                </p>
                <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted-foreground/75">
                  {pack.note}
                </p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="tabular-nums font-normal text-[2.25rem] leading-none tracking-[-0.03em]">{`${topUps.currency}${pack.price}`}</span>
                  <span className="mb-1 text-[0.75rem] text-muted-foreground">
                    {topUps.oneTime}
                  </span>
                </div>

                <div className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4 text-[0.75rem]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <Film className="size-3.5 shrink-0" />
                      <span className="truncate">{motion.displayName}</span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {topUps.upTo} {seconds} {topUps.seconds}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <ImageIcon className="size-3.5 shrink-0" />
                      <span className="truncate">{image.displayName}</span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {topUps.upTo} {images} {topUps.images}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[0.6875rem] text-muted-foreground">
                  <span>{topUps.balance}</span>
                  <span>{topUps.neverExpires}</span>
                </div>
                <div className="mt-auto pt-5">
                  <Button
                    asChild
                    variant={pack.popular ? "default" : "outline"}
                    className={cn(
                      "h-10 w-full rounded-lg text-[0.75rem] font-medium",
                      pack.popular
                        ? "bg-brand text-brand-foreground hover:bg-brand-hover"
                        : "border-white/10 bg-transparent text-foreground hover:bg-white/[0.04]",
                    )}
                  >
                    <Link href="/billing">
                      {topUps.topUp}
                      {pack.price}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <PricingCustomTopUp
          videoModels={videoRates}
          imageModels={imageRates}
        />
        <p className="mt-3 text-[0.6875rem] text-muted-foreground">
          {topUps.capacityNote}
        </p>
      </section>

      <div id="model-rates" className="mt-14 scroll-mt-20">
        <PricingModelRates />
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <SectionHeader title={faq.title} description={faq.description} />
        <PricingFaq />
      </section>
    </div>
  );
}
