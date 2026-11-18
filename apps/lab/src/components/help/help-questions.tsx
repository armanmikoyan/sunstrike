"use client";

import { Faq } from "@/components/faq";
import { HELP_QUESTIONS } from "./constants";

export function HelpQuestions() {
  return (
    <Faq
      items={HELP_QUESTIONS}
      className="min-h-85 md:min-h-73.5 lg:min-h-70"
      questionClassName="py-3.5"
      answerClassName="max-w-140 pb-3.5"
    />
  );
}
