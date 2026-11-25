import * as service from "./service";

/** Model registry: active models, capability validation, and provider sync. */
export const catalog = {
  listActiveModels: service.listActiveModels,
  getModel: service.getModel,
  validateGenerationSettings: service.validateGenerationSettings,
  setModelActive: service.setModelActive,
  registerProviderAdapter: service.registerProviderAdapter,
  syncProviderModels: service.syncProviderModels,
  syncFromProvider: service.syncFromProvider,
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
  ProviderCostUnit,
  UpsertProviderModelInput,
} from "./types";
