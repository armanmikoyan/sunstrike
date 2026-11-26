import { connectInfra, disconnectInfra } from "@/infra";
import { logger } from "@/infra/logger";
import { fake } from "@/modules/fake";
import { generations } from "@/modules/generations";
import { notifications } from "@/modules/notifications";

async function startWorker(): Promise<void> {
  await connectInfra();

  const controller = new AbortController();
  const stopListening = notifications.listen();
  const shutdown = () => controller.abort();

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  logger.info("Generation worker started");

  try {
    // Temporary: swap for the Runware provider when the fake module is removed.
    await generations.runWorker(controller.signal, fake.provider);
  } finally {
    stopListening();
    await disconnectInfra();
    logger.info("Generation worker stopped");
  }
}

await startWorker();
