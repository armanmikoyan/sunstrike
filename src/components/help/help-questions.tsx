"use client";

import { Faq } from "@/components/faq";
import { helpQuestions } from "./constants";

export function HelpQuestions() {
  return (
    <Faq
      items={helpQuestions}
      className="min-h-[20.25rem] min-[360px]:min-h-[18.75rem] md:min-h-[17.5rem]"
      questionClassName="py-3.5 text-[0.6875rem]"
      answerClassName="max-w-[35rem] pb-3.5"
    />
  );
}
