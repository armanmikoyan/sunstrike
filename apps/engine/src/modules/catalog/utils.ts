import { isOneOf } from "@/shared/utils";
import { DEFAULT_PROVIDER_COST_UNIT, GENERATION_MODES, MODEL_INPUT_KINDS, PROVIDER_COST_UNITS } from "./constants";
import type { ProviderCapabilities, ProviderSyncUpdate } from "./providers/types";
import type {
  CapabilityValidationResult,
  CatalogModel,
  CatalogModelWithCost,
  GenerationMode,
  GenerationSettingsInput,
  ModelCapabilities,
  ModelRow,
  UpsertProviderModelInput,
} from "./types";

export function isGenerationMode(value: unknown): value is GenerationMode {
  return isOneOf(GENERATION_MODES, value);
}

export function mapModelRow(row: ModelRow): CatalogModelWithCost {
  const costMicros =
    typeof row.provider_cost_micros === "number"
      ? row.provider_cost_micros
      : Number.parseInt(row.provider_cost_micros, 10);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    provider: row.provider,
    providerModelKey: row.provider_model_key,
    vendor: row.vendor_id
      ? { id: row.vendor_id, name: row.vendor_name ?? row.vendor_id, logoUrl: row.vendor_logo_url }
      : null,
    capabilities: {
      modes: row.supported_modes.filter(isGenerationMode),
      inputs: row.supported_inputs.filter((kind) => isOneOf(MODEL_INPUT_KINDS, kind)),
      resolutions: row.resolutions,
      durationsSeconds: row.durations_seconds,
      aspectRatios: row.aspect_ratios,
      audio: row.supports_audio,
    },
    providerCostMicros: Number.isFinite(costMicros) ? costMicros : 0,
    providerCostUnit: isOneOf(PROVIDER_COST_UNITS, row.provider_cost_unit)
      ? row.provider_cost_unit
      : DEFAULT_PROVIDER_COST_UNIT,
    active: row.active,
    updatedAt: row.updated_at,
  };
}

export function toPublicModel(model: CatalogModelWithCost): CatalogModel {
  const { providerCostMicros: _cost, providerCostUnit: _unit, ...publicModel } = model;

  return publicModel;
}

export function filterModelsByMode(
  models: readonly CatalogModelWithCost[],
  mode?: GenerationMode,
): CatalogModelWithCost[] {
  if (!mode) return [...models];

  return models.filter((model) => model.capabilities.modes.includes(mode));
}

export function filterModelsByProvider(
  models: readonly CatalogModelWithCost[],
  provider: string,
): CatalogModelWithCost[] {
  return models.filter((model) => model.provider === provider);
}

export function toModelCapabilities(capabilities: ProviderCapabilities): ModelCapabilities {
  return {
    ...capabilities,
    modes: capabilities.modes.filter(isGenerationMode),
    inputs: capabilities.inputs.filter((kind) => isOneOf(MODEL_INPUT_KINDS, kind)),
  };
}

export function mergeProviderUpdates(
  models: readonly CatalogModelWithCost[],
  updates: readonly ProviderSyncUpdate[],
): UpsertProviderModelInput[] {
  const byKey = new Map(models.map((model) => [model.providerModelKey, model]));
  const inputs: UpsertProviderModelInput[] = [];

  for (const update of updates) {
    const current = byKey.get(update.providerModelKey);

    if (!current) continue;

    const unit = update.cost?.unit;
    const cost = update.cost && isOneOf(PROVIDER_COST_UNITS, unit) ? { micros: update.cost.micros, unit } : null;

    inputs.push({
      slug: current.slug,
      name: current.name,
      summary: current.summary,
      provider: current.provider,
      providerModelKey: current.providerModelKey,
      vendor: update.vendor ?? current.vendor,
      capabilities: update.capabilities ? toModelCapabilities(update.capabilities) : current.capabilities,
      providerCostMicros: cost ? cost.micros : current.providerCostMicros,
      providerCostUnit: cost ? cost.unit : current.providerCostUnit,
      active: update.active,
    });
  }

  return inputs;
}

export function validateModelCapabilities(
  model: CatalogModel,
  settings: GenerationSettingsInput,
): CapabilityValidationResult {
  if (!model.active) {
    return {
      ok: false,
      code: "model_inactive",
      message: `Model "${model.slug}" is currently disabled.`,
    };
  }

  const { capabilities } = model;

  if (!capabilities.modes.includes(settings.mode)) {
    return {
      ok: false,
      code: "unsupported_mode",
      message: `Model "${model.slug}" does not support "${settings.mode}" generation.`,
    };
  }

  if (!capabilities.resolutions.includes(settings.resolution)) {
    return {
      ok: false,
      code: "unsupported_resolution",
      message: `Resolution "${settings.resolution}" is not supported by "${model.slug}".`,
    };
  }

  if (!capabilities.aspectRatios.includes(settings.aspectRatio)) {
    return {
      ok: false,
      code: "unsupported_aspect_ratio",
      message: `Aspect ratio "${settings.aspectRatio}" is not supported by "${model.slug}".`,
    };
  }

  if (settings.mode === "video") {
    if (
      typeof settings.durationSeconds !== "number" ||
      !capabilities.durationsSeconds.includes(settings.durationSeconds)
    ) {
      return {
        ok: false,
        code: "unsupported_duration",
        message: `Duration "${String(settings.durationSeconds ?? "")}" is not supported by "${model.slug}".`,
      };
    }
  } else if (settings.durationSeconds !== undefined && settings.durationSeconds !== null) {
    return {
      ok: false,
      code: "unsupported_duration",
      message: `Duration is not applicable for "${settings.mode}" generation on "${model.slug}".`,
    };
  }

  if (settings.audio && !capabilities.audio) {
    return {
      ok: false,
      code: "unsupported_audio",
      message: `Model "${model.slug}" does not support generated audio.`,
    };
  }

  if (settings.inputs && settings.inputs.length > 0) {
    const unsupported = settings.inputs.find((kind) => !capabilities.inputs.includes(kind));

    if (unsupported) {
      return {
        ok: false,
        code: "unsupported_input",
        message: `Input kind "${unsupported}" is not supported by "${model.slug}".`,
      };
    }
  }

  return { ok: true, model };
}
