import { connectInfra, disconnectInfra } from "@/infra";
import { logger } from "@/infra/logger";
import { catalog } from "@/modules/catalog";

async function syncCatalog(): Promise<void> {
  await connectInfra();

  try {
    const models = await catalog.syncAllProviders();

    for (const model of models) {
      logger.info(
        { provider: model.provider, key: model.providerModelKey, active: model.active },
        `Synced ${model.name}`,
      );
    }

    logger.info(`Catalog sync done: ${models.length} model(s).`);
  } finally {
    await disconnectInfra();
  }
}

try {
  await syncCatalog();
} catch (error) {
  logger.error({ err: error }, "Catalog sync failed");
  process.exitCode = 1;
}
