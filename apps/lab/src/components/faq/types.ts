export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqProps = {
  items: FaqItem[];
  columns?: 1 | 2;
  className?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
};
