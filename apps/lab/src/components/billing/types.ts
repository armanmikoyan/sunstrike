export type UsageTransactionKind = "video" | "image" | "top-up" | "refund";

export type UsageTransaction = {
  id: string;
  kind: UsageTransactionKind;
  title: string;
  detail: string;
  date: string;
  amount: string;
  status: string;
};

export type UsageTransactionRowProps = {
  transaction: UsageTransaction;
};
