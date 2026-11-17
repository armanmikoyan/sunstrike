"use client";

import { Faq } from "@/components/faq";
import { pricingFaqs } from "./constants";

export function PricingFaq() {
  return (
    <Faq
      items={pricingFaqs}
      columns={2}
      className="mt-4 min-h-[24rem] md:min-h-[16rem] xl:min-h-[13.5rem]"
    />
  );
}
