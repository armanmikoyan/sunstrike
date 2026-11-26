import * as service from "./service";
import { runWorker } from "./worker";

/** Generation jobs: quoting and queueing requests, running them through a provider, and announcing results. */
export const generations = {
  getGeneration: service.getGeneration,
  onFinished: service.onFinished,
  processNextJob: service.processNextJob,
  runWorker,
};

export type { GenerationProvider, ProviderJob, ProviderResult } from "./providers/types";
export type { GenerationFinished, GenerationStatus, GenerationView } from "./types";
