"use client";

import { Faq } from "@/components/faq";
import { helpQuestions } from "./constants";

export function HelpQuestions() {
  return (
    <Faq
      items={helpQuestions}
      className="min-h-[21.25rem] md:min-h-[18.375rem] lg:min-h-[17.5rem]"
      questionClassName="py-3.5 text-xs lg:text-[0.6875rem]"
      answerClassName="max-w-[35rem] pb-3.5"
    />
  );
}
