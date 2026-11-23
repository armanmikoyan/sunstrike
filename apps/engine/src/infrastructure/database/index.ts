import { Pool, type PoolClient } from "pg";
import { config } from "@/infrastructure/config";
import { logger } from "@/infrastructure/logger";
import type { Row, Transaction } from "./types";

let pool: Pool | undefined;

function connection(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl(),
      min: 1,
      keepAlive: true,
      connectionTimeoutMillis: 5000,
    });
    pool.on("error", (error) => {
      logger.error({ err: error }, "Idle database client failed");
    });
  }

  return pool;
}

async function run<T>(client: Pool | PoolClient, text: string, values: unknown[]): Promise<T[]> {
  const result = await client.query<T & Row>(text, values);

  return result.rows;
}

export type { Row, Transaction } from "./types";

export function query<T = Row>(text: string, values: unknown[] = []): Promise<T[]> {
  return run<T>(connection(), text, values);
}

/** Create the pool and open its first connection. */
export async function connect(): Promise<void> {
  const client = await connection().connect();

  client.release();
}

/** Round-trip a trivial query so callers can report real connectivity. */
export async function ping(): Promise<void> {
  await query("select 1");
}

function scoped(client: PoolClient): Transaction {
  return {
    query: <T = Row>(text: string, values: unknown[] = []) => run<T>(client, text, values),
  };
}

export async function transaction<T>(work: (tx: Transaction) => Promise<T>): Promise<T> {
  const client = await connection().connect();

  try {
    await client.query("begin");

    const result = await work(scoped(client));

    await client.query("commit");

    return result;
  } catch (error) {
    await client.query("rollback");

    throw error;
  } finally {
    client.release();
  }
}
