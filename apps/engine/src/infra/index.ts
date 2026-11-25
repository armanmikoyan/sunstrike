import { DATABASE_STATUS } from "./constants";
import * as database from "./database";
import { logger } from "./logger";
import type { InfraHealth } from "./types";
import { toInfraHealth } from "./utils";

export async function connectInfra(): Promise<InfraHealth> {
  try {
    await database.connect();
    logger.info("Database connected");
    return toInfraHealth(DATABASE_STATUS.connected);
  } catch (error) {
    logger.error({ err: error }, "Database connection failed");
    return toInfraHealth(DATABASE_STATUS.unavailable);
  }
}

export async function disconnectInfra(): Promise<void> {
  await database.disconnect();
}

export async function checkInfraHealth(): Promise<InfraHealth> {
  try {
    await database.ping();
    return toInfraHealth(DATABASE_STATUS.connected);
  } catch (error) {
    logger.warn({ err: error }, "Health check could not reach the database");
    return toInfraHealth(DATABASE_STATUS.unavailable);
  }
}
