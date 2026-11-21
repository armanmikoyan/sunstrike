import { Pool, type PoolClient } from "pg";
import { config } from "@/infrastructure/config";
import type { Row, Transaction } from "./types";

let pool: Pool | undefined;

function connection(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: config.databaseUrl() });
    pool.on("error", (error) => {
      console.error("Database connection failed", error);
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
