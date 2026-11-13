"use client";

import { Disclosure } from "@/components/disclosure";
import { helpQuestions } from "./constants";

export function HelpQuestions() {
  return (
    <div className="mt-3">
      {helpQuestions.map((item) => (
        <Disclosure
          key={item.question}
          question={item.question}
          answer={item.answer}
          className="py-3.5"
          questionClassName="text-[0.6875rem]"
          answerClassName="max-w-[35rem]"
        />
      ))}
    </div>
  );
}
