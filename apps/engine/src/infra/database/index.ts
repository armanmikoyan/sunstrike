import { Pool, type PoolClient } from "pg";
import { config } from "@/infra/config";
import { logger } from "@/infra/logger";
import type { Row, Transaction } from "./types";
import { poolOptions } from "./utils";

let pool: Pool | undefined;

function connection(): Pool {
  if (!pool) {
    pool = new Pool(poolOptions(config.databaseUrl()));
    pool.on("error", (error) => {
      logger.warn({ err: error }, "Idle database connection was dropped");
    });
  }

  return pool;
}

async function run<T>(client: Pool | PoolClient, text: string, values: unknown[]): Promise<T[]> {
  const result = await client.query<T & Row>(text, values);

  return result.rows;
}

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

/** Close the database pool on shutdown. */
export async function disconnect(): Promise<void> {
  if (!pool) return;

  const active = pool;
  pool = undefined;
  await active.end();
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
