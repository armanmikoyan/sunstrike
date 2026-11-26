import { setTimeout as sleep } from "node:timers/promises";
import { logger } from "@/infra/logger";
import { QUEUE } from "./constants";
import type { GenerationProvider } from "./providers/types";
import * as service from "./service";

async function step(provider: GenerationProvider): Promise<boolean> {
  try {
    return await service.processNextJob(provider);
  } catch (error) {
    logger.error({ err: error }, "Generation job failed; its lease will expire and it will be claimed again");
    return false;
  }
}

/** Run due jobs through `provider` back to back until `signal` aborts, pausing while the queue is empty. */
export async function runWorker(signal: AbortSignal, provider: GenerationProvider): Promise<void> {
  logger.info({ provider: provider.name }, "Generation worker running");

  while (!signal.aborted) {
    if (!(await step(provider))) await sleep(QUEUE.idleDelayMs, undefined, { signal }).catch(() => undefined);
  }
}
