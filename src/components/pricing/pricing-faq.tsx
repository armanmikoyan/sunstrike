"use client";

import { Disclosure } from "@/components/disclosure";
import { pricingFaqs } from "./constants";

export function PricingFaq() {
  return (
    <div className="mt-4 grid gap-x-12 md:grid-cols-2">
      {pricingFaqs.map((item) => (
        <Disclosure
          key={item.question}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </div>
  );
}
