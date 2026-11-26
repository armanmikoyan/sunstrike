import { query } from "@/infra/database";
import type { Transaction } from "@/infra/database/types";
import type { Balance, BalanceRow, LedgerEntry, NewEntry, TransactionRow } from "./types";
import { mapBalanceRow, mapTransactionRow } from "./utils";

const pool: Transaction = { query };

const columns = `
  id,
  user_id,
  generation_id,
  type,
  amount_micros,
  idempotency_key,
  created_at
`;

/** Serialise a user's balance changes until the transaction ends, so two holds never spend the same money. */
export async function lockUser(tx: Transaction, userId: string): Promise<void> {
  await tx.query("select pg_advisory_xact_lock(hashtextextended($1, 0))", [userId]);
}

export async function getBalance(userId: string, db: Transaction = pool): Promise<Balance> {
  const rows = await db.query<BalanceRow>(
    `select
       coalesce(sum(case
         when type in ('top_up', 'refund', 'release') then amount_micros
         when type = 'reserve' then -amount_micros
         else 0
       end), 0) as available_micros,
       coalesce(sum(case
         when type = 'reserve' then amount_micros
         when type in ('capture', 'release') then -amount_micros
         else 0
       end), 0) as reserved_micros
     from transactions
     where user_id = $1`,
    [userId],
  );

  return mapBalanceRow(rows[0]);
}

export async function findByKey(idempotencyKey: string, db: Transaction = pool): Promise<LedgerEntry | null> {
  const rows = await db.query<TransactionRow>(`select ${columns} from transactions where idempotency_key = $1`, [
    idempotencyKey,
  ]);

  return rows[0] ? mapTransactionRow(rows[0]) : null;
}

/** Add one ledger row; null when its idempotency key was already written. */
export async function insertEntry(entry: NewEntry, db: Transaction = pool): Promise<LedgerEntry | null> {
  const rows = await db.query<TransactionRow>(
    `insert into transactions (user_id, generation_id, type, amount_micros, idempotency_key)
     values ($1, $2, $3, $4, $5)
     on conflict (idempotency_key) do nothing
     returning ${columns}`,
    [entry.userId, entry.generationId, entry.type, entry.amountMicros, entry.idempotencyKey],
  );

  return rows[0] ? mapTransactionRow(rows[0]) : null;
}
