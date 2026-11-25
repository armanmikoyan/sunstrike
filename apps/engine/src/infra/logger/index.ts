import { pino } from "pino";
import { config } from "@/infra/config";

/**
 * Structured logger. JSON in production so collectors can parse it, and
 * human-readable output in development.
 */
export const logger = pino({
  level: config.logLevel(),
  ...(config.isProduction()
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss.l", ignore: "pid,hostname" },
        },
      }),
});
