import { app } from "./app";
import { config } from "@/infrastructure/config";
import { connect } from "@/infrastructure/database";
import { logger } from "@/infrastructure/logger";

async function main(): Promise<void> {
  const port = config.port();

  try {
    await connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed");
  }

  app.listen(port, () => {
    logger.info(`Engine listening on http://localhost:${port}`);
  });
}

await main();
