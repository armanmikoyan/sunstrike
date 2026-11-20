import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { PageShell } from "@/ui/page-shell";
import { Button } from "@/ui/button";
import { imageRates, videoRates } from "@/mocks/pricing";
import { PRICING_COPY, PRICING_POINTS } from "./constants";
import { PricingFaq } from "./pricing-faq";
import { PricingModelRates } from "./pricing-model-rates";
import { PricingTopUps } from "./pricing-top-ups";

export function Pricing() {
  return (
    <PageShell className="py-8 sm:py-10">
      <section className="flex flex-col justify-between gap-8 border-b border-border pb-8 lg:flex-row lg:items-end">
        <div className="max-w-192">
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{PRICING_COPY.hero.eyebrow}</p>
          <h1 className="mt-3 text-balance font-grotesk text-[2rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[2.375rem]">
            {PRICING_COPY.hero.titleBefore}
            {PRICING_COPY.hero.titleAccent}
            {PRICING_COPY.hero.titleAfter}
          </h1>
          <p className="mt-4 max-w-144 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {PRICING_COPY.hero.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {PRICING_POINTS.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
                <Check className="size-3.5 text-muted-foreground" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button asChild size="cta">
            <Link href="/create/video">
              {PRICING_COPY.hero.primaryAction}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-lg border-white/10 bg-transparent px-4 text-xs lg:text-[0.6875rem] text-foreground hover:bg-white/4"
          >
            <a href="#model-rates">{PRICING_COPY.hero.secondaryAction}</a>
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <PricingTopUps videoModels={videoRates} imageModels={imageRates} />
      </section>

      <div id="model-rates" className="mt-14 scroll-mt-20">
        <PricingModelRates />
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <SectionHeader title={PRICING_COPY.faq.title} description={PRICING_COPY.faq.description} />
        <PricingFaq />
      </section>
    </PageShell>
  );
}
