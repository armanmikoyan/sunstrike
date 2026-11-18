"use client";

import { Faq } from "@/components/faq";
import { PRICING_FAQS } from "./constants";

export function PricingFaq() {
  return <Faq items={PRICING_FAQS} columns={2} className="mt-4 min-h-96 md:min-h-64 xl:min-h-54" />;
}
