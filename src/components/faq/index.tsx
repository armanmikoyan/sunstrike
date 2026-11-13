"use client";

import { useState } from "react";
import { Disclosure } from "@/components/disclosure";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqProps = {
  items: FaqItem[];
  columns?: 1 | 2;
  className?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
};

export function Faq({
  items,
  columns = 1,
  className,
  itemClassName,
  questionClassName,
  answerClassName,
}: FaqProps) {
  const [active, setActive] = useState<number | null>(null);
  const indexed = items.map((item, index) => ({ item, index }));

  if (columns === 2) {
    const columnItems = [0, 1].map((column) =>
      indexed.filter(({ index }) => index % 2 === column),
    );

    return (
      <div
        className={cn(
          "flex flex-col md:grid md:grid-cols-2 md:items-start md:gap-x-12",
          className,
        )}
      >
        {columnItems.map((column, columnIndex) => (
          <div key={columnIndex} className="contents md:flex md:flex-col">
            {column.map(({ item, index }) => (
              <div key={item.question} style={{ order: index }}>
                <Disclosure
                  question={item.question}
                  answer={item.answer}
                  className={itemClassName}
                  questionClassName={questionClassName}
                  answerClassName={answerClassName}
                  open={active === index}
                  onOpenChange={(open) => setActive(open ? index : null)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <Disclosure
          key={item.question}
          question={item.question}
          answer={item.answer}
          className={itemClassName}
          questionClassName={questionClassName}
          answerClassName={answerClassName}
          open={active === index}
          onOpenChange={(open) => setActive(open ? index : null)}
        />
      ))}
    </div>
  );
}
