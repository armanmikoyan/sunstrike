import * as service from "./service";

/** Runtime health probe for the engine and its database connection. */
export const health = {
  getHealth: service.getHealth,
};

export type { HealthReport } from "./types";
