export type DisclosureProps = {
  question: string;
  answer: string;
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
  iconClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
