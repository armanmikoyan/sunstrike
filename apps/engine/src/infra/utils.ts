import { DATABASE_STATUS } from "./constants";
import type { DatabaseStatus, InfraHealth } from "./types";

export function toInfraHealth(database: DatabaseStatus): InfraHealth {
  return {
    ok: database === DATABASE_STATUS.connected,
    database,
  };
}
