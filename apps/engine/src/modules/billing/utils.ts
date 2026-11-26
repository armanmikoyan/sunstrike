import { toIsoString, toSafeInteger } from "@/shared/utils";
import { CURRENCY } from "./constants";
import type { Balance, BalanceRow, LedgerEntry, TransactionRow } from "./types";

/** The ledger key that holds a generation's price once. */
export function reserveKey(generationId: string): string {
  return `reserve:${generationId}`;
}

/** The ledger key that credits one payment once, from the payment's own reference. */
export function topUpKey(reference: string): string {
  return `top-up:${reference}`;
}

/** The one ledger key capture and release share, so a generation settles once and one way. */
export function settleKey(generationId: string): string {
  return `settle:${generationId}`;
}

export function mapBalanceRow(row: BalanceRow | undefined): Balance {
  return {
    availableMicros: row ? toSafeInteger(row.available_micros) : 0,
    reservedMicros: row ? toSafeInteger(row.reserved_micros) : 0,
    currency: CURRENCY,
  };
}

export function mapTransactionRow(row: TransactionRow): LedgerEntry {
  return {
    id: row.id,
    userId: row.user_id,
    generationId: row.generation_id,
    type: row.type,
    amountMicros: toSafeInteger(row.amount_micros),
    idempotencyKey: row.idempotency_key,
    createdAt: toIsoString(row.created_at),
  };
}
