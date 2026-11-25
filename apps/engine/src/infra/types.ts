import type { DATABASE_STATUS } from "./constants";

export type DatabaseStatus = (typeof DATABASE_STATUS)[keyof typeof DATABASE_STATUS];

export interface InfraHealth {
  ok: boolean;
  database: DatabaseStatus;
}
