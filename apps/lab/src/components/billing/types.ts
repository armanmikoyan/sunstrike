import type { BILLING_TRANSACTIONS } from "./constants";

export type UsageTransaction = (typeof BILLING_TRANSACTIONS)[number];

export type UsageTransactionRowProps = {
  transaction: UsageTransaction;
};
