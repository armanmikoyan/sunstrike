"use client";

import { Faq } from "@/components/faq";
import { pricingFaqs } from "./constants";

export function PricingFaq() {
  return <Faq
      items={pricingFaqs}
      columns={2}
      className="mt-4 min-h-[22.25rem] min-[360px]:min-h-[21rem] md:min-h-[14.5rem] xl:min-h-[13.5rem]"
    />;
}
