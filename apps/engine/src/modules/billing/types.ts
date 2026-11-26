import type { CURRENCY, TRANSACTION_TYPES } from "./constants";

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/** How a reservation ends: spent on success, or returned on failure. */
export type Settlement = Extract<TransactionType, "capture" | "release">;

/** A user's money, derived from the ledger: spendable now, and held for running generations. */
export interface Balance {
  availableMicros: number;
  reservedMicros: number;
  currency: typeof CURRENCY;
}

export interface BalanceRow {
  available_micros: string | number;
  reserved_micros: string | number;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  generationId: string | null;
  type: TransactionType;
  amountMicros: number;
  idempotencyKey: string;
  createdAt: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  generation_id: string | null;
  type: TransactionType;
  amount_micros: string | number;
  idempotency_key: string;
  created_at: Date | string;
}

export type NewEntry = Omit<LedgerEntry, "id" | "createdAt">;

export interface ReserveRequest {
  userId: string;
  generationId: string;
  amountMicros: number;
}

/** A confirmed payment to credit; `reference` is the payment's own id, so it credits once. */
export interface TopUpCredit {
  userId: string;
  amountMicros: number;
  reference: string;
}
