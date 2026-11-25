import type { DatabaseStatus } from "@/infra/types";

export interface HealthReport {
  status: "ok" | "error";
  database: DatabaseStatus;
}
