import { createApp } from "./app";
import { connectInfra, disconnectInfra } from "@/infra";
import { config } from "@/infra/config";
import { logger } from "@/infra/logger";

async function startServer(): Promise<void> {
  await connectInfra();

  const app = createApp();
  const port = config.port();
  const server = app.listen(port, () => {
    logger.info(`Engine listening on http://localhost:${port}`);
  });

  const shutdown = () => {
    server.close(() => {
      disconnectInfra();
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

await startServer();
