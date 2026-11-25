import { checkInfraHealth } from "@/infra";
import type { HealthReport } from "./types";

export async function getHealth(): Promise<{ statusCode: number; body: HealthReport }> {
  const health = await checkInfraHealth();

  return {
    statusCode: health.ok ? 200 : 503,
    body: {
      status: health.ok ? "ok" : "error",
      database: health.database,
    },
  };
}
