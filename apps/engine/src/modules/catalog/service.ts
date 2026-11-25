import { badRequest, isUuid, notFound } from "@/shared/utils";
import { GENERATION_MODES } from "./constants";
import { getProviderAdapter, listProviderAdapters, registerProviderAdapter as registerAdapter } from "./providers";
import type { CatalogProviderAdapter } from "./providers/types";
import * as repository from "./repository";
import type { CatalogModel, CatalogModelWithCost, GenerationSettingsInput, UpsertProviderModelInput } from "./types";
import {
  filterModelsByMode,
  filterModelsByProvider,
  isGenerationMode,
  mergeProviderUpdates,
  toPublicModel,
  validateModelCapabilities,
} from "./utils";

export async function listActiveModels(
  mode?: string,
  includeCost: boolean = false,
): Promise<CatalogModel[] | CatalogModelWithCost[]> {
  if (mode !== undefined && mode !== "" && !isGenerationMode(mode)) {
    throw badRequest(`Invalid mode. Expected one of: ${GENERATION_MODES.join(", ")}.`);
  }

  const models = filterModelsByMode(await repository.listActive(), isGenerationMode(mode) ? mode : undefined);

  return includeCost ? models : models.map(toPublicModel);
}

export async function getModel(
  idOrSlug: string,
  includeCost: boolean = false,
): Promise<CatalogModel | CatalogModelWithCost> {
  const key = idOrSlug.trim();
  const model = key ? (isUuid(key) ? await repository.findById(key) : await repository.findBySlug(key)) : null;

  if (!model || (!includeCost && !model.active)) {
    throw notFound("Model not found.");
  }

  return includeCost ? model : toPublicModel(model);
}

export async function validateGenerationSettings(
  idOrSlug: string,
  settings: GenerationSettingsInput,
): Promise<CatalogModel> {
  const model = await getModel(idOrSlug, true);
  const result = validateModelCapabilities(model, settings);

  if (!result.ok) {
    throw badRequest(result.message);
  }

  return result.model;
}

export async function setModelActive(id: string, active: boolean): Promise<CatalogModelWithCost> {
  const updated = await repository.setActive(id, active);

  if (!updated) {
    throw notFound("Model not found.");
  }

  return updated;
}

export async function syncProviderModels(inputs: readonly UpsertProviderModelInput[]): Promise<CatalogModelWithCost[]> {
  const updated: CatalogModelWithCost[] = [];

  for (const input of inputs) {
    updated.push(await repository.upsertProviderModel(input));
  }

  return updated;
}

export function registerProviderAdapter(adapter: CatalogProviderAdapter): void {
  registerAdapter(adapter);
}

export async function syncFromProvider(
  provider: string,
  adapter?: CatalogProviderAdapter,
): Promise<CatalogModelWithCost[]> {
  const resolved = adapter ?? getProviderAdapter(provider);

  if (!resolved) {
    throw notFound(`No catalog provider adapter registered for "${provider}".`);
  }

  const scoped = filterModelsByProvider(await repository.listAll(), provider);

  if (scoped.length === 0) return [];

  const remoteUpdates = await resolved.fetchModelUpdates(scoped);

  if (remoteUpdates.length === 0) return [];

  return syncProviderModels(mergeProviderUpdates(scoped, remoteUpdates));
}

export async function syncAllProviders(): Promise<CatalogModelWithCost[]> {
  const synced: CatalogModelWithCost[] = [];

  for (const adapter of listProviderAdapters()) {
    synced.push(...(await syncFromProvider(adapter.provider, adapter)));
  }

  return synced;
}
