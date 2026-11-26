import * as service from "./service";
import { isGenerationMode } from "./utils";

/** Model registry: active models, capability validation, and provider sync. */
export const catalog = {
  isGenerationMode,
  listActiveModels: service.listActiveModels,
  getModel: service.getModel,
  validateGenerationSettings: service.validateGenerationSettings,
  setModelActive: service.setModelActive,
  registerProviderAdapter: service.registerProviderAdapter,
  syncProviderModels: service.syncProviderModels,
  syncFromProvider: service.syncFromProvider,
  syncAllProviders: service.syncAllProviders,
};

export type { CatalogProviderAdapter, ProviderSyncTarget, ProviderSyncUpdate } from "./providers/types";
export type {
  CapabilityValidationResult,
  CatalogModel,
  CatalogModelWithCost,
  GenerationMode,
  GenerationSettingsInput,
  ModelCapabilities,
  ModelInputKind,
  ModelVendor,
  ProviderCostUnit,
  UpsertProviderModelInput,
} from "./types";
