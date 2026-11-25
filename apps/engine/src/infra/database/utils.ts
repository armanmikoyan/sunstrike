import type { PoolConfig } from "pg";
import { POOL_CONNECTION_TIMEOUT_MS, POOL_IDLE_TIMEOUT_MS, POOL_MIN_CONNECTIONS } from "./constants";

export function poolOptions(connectionString: string): PoolConfig {
  return {
    connectionString,
    // The Supabase pooler reaps idle sessions on its own schedule. Holding a
    // minimum connection open means the pooler eventually resets it under us,
    // so let the pool retire idle clients first and reconnect on demand.
    min: POOL_MIN_CONNECTIONS,
    idleTimeoutMillis: POOL_IDLE_TIMEOUT_MS,
    keepAlive: true,
    connectionTimeoutMillis: POOL_CONNECTION_TIMEOUT_MS,
  };
}
