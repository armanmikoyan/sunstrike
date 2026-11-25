import type { GENERATION_MODES, MODEL_INPUT_KINDS, PROVIDER_COST_UNITS } from "./constants";

export type GenerationMode = (typeof GENERATION_MODES)[number];

export type ModelInputKind = (typeof MODEL_INPUT_KINDS)[number];

export type ProviderCostUnit = (typeof PROVIDER_COST_UNITS)[number];

export interface ModelCapabilities {
  modes: GenerationMode[];
  inputs: ModelInputKind[];
  resolutions: string[];
  durationsSeconds: number[];
  aspectRatios: string[];
  audio: boolean;
}

/** Public model representation served to clients (never exposes upstream provider costs). */
export interface CatalogModel {
  id: string;
  slug: string;
  name: string;
  summary: string;
  provider: string;
  providerModelKey: string;
  capabilities: ModelCapabilities;
  active: boolean;
  updatedAt: string;
}

/** Internal read model shared with sibling modules such as pricing and generation. */
export interface CatalogModelWithCost extends CatalogModel {
  providerCostMicros: number;
  providerCostUnit: ProviderCostUnit;
}

export interface ModelRow {
  id: string;
  slug: string;
  name: string;
  summary: string;
  provider: string;
  provider_model_key: string;
  supported_modes: string[];
  supported_inputs: string[];
  resolutions: string[];
  durations_seconds: number[];
  aspect_ratios: string[];
  supports_audio: boolean;
  provider_cost_micros: string | number;
  provider_cost_unit: string;
  sort_order: number;
  active: boolean;
  updated_at: string;
}

export interface GenerationSettingsInput {
  mode: GenerationMode;
  resolution: string;
  durationSeconds?: number | null;
  aspectRatio: string;
  audio?: boolean;
  inputs?: ModelInputKind[];
}

export type CapabilityValidationResult =
  | { ok: true; model: CatalogModel }
  | { ok: false; code: string; message: string };

export interface UpsertProviderModelInput {
  slug: string;
  name: string;
  summary?: string;
  provider: string;
  providerModelKey: string;
  capabilities: ModelCapabilities;
  providerCostMicros: number;
  providerCostUnit: ProviderCostUnit;
  sortOrder?: number;
  active?: boolean;
}

export interface ListModelsQuery {
  mode?: unknown;
}
