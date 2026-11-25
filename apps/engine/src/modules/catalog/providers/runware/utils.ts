import { isRecord } from "@/shared/utils";
import {
  MICROS_PER_USD,
  RUNWARE_AUDIO_CAPABILITY,
  RUNWARE_COST_UNITS,
  RUNWARE_INPUT_KINDS,
  RUNWARE_LIVE_STATUS,
  RUNWARE_MODES,
  RUNWARE_PRESET_TITLE,
} from "./constants";
import type {
  RunwareCapabilities,
  RunwareCost,
  RunwareModelSchema,
  RunwareModelUpdate,
  RunwareProperty,
  RunwareSizePreset,
  RunwareVendor,
} from "./types";

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export function sizePresets(node: unknown): RunwareSizePreset[] {
  if (Array.isArray(node)) return node.flatMap(sizePresets);
  if (!isRecord(node)) return [];

  const match = typeof node.title === "string" ? RUNWARE_PRESET_TITLE.exec(node.title) : null;
  const own = match?.[1] && match[2] ? [{ resolution: match[1], aspectRatio: match[2] }] : [];

  return [...own, ...Object.values(node).flatMap(sizePresets)];
}

export function durationOptions(property: RunwareProperty | undefined): number[] {
  if (!property) return [];

  const listed = property.enum?.filter((value): value is number => Number.isInteger(value));

  if (listed?.length) return listed;

  const { minimum, maximum } = property;

  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum === undefined || maximum === undefined) {
    return [];
  }

  return Array.from({ length: Math.max(0, maximum - minimum + 1) }, (_, index) => minimum + index);
}

export function inputKinds(names: readonly string[]): string[] {
  return RUNWARE_INPUT_KINDS.filter(([, pattern]) => names.some((name) => pattern.test(name))).map(([kind]) => kind);
}

export function toCapabilities(schema: RunwareModelSchema): RunwareCapabilities {
  const task = schema.components.schemas.RequestBody.items;
  const properties = task.properties ?? {};
  const presets = sizePresets(task.allOf ?? []);
  const tags = schema.info["x-capabilities"];
  const resolutionEnum = properties.resolution?.enum?.filter((value): value is string => typeof value === "string");

  return {
    modes: unique(tags.flatMap((tag): string[] => (RUNWARE_MODES[tag] ? [RUNWARE_MODES[tag]] : []))),
    inputs: inputKinds(Object.keys(properties.inputs?.properties ?? {})),
    resolutions: resolutionEnum?.length ? resolutionEnum : unique(presets.map((preset) => preset.resolution)),
    durationsSeconds: durationOptions(properties.duration),
    aspectRatios: unique(presets.map((preset) => preset.aspectRatio)),
    audio: tags.includes(RUNWARE_AUDIO_CAPABILITY),
  };
}

/**
 * The highest output rate, so a margin set against it holds at every resolution
 * and option. Input surcharges, such as per reference image, are left out.
 */
export function toCost(schema: RunwareModelSchema): RunwareCost | null {
  const pricing = schema.info["x-pricing"];

  if (!pricing || pricing.currency !== "USD") return null;

  const rates = pricing.rates.filter((rate) => RUNWARE_COST_UNITS[rate.unit]);
  const units = unique(rates.map((rate) => RUNWARE_COST_UNITS[rate.unit]));
  const unit = units.length === 1 ? units[0] : undefined;

  if (!unit) return null;

  return { micros: Math.round(Math.max(...rates.map((rate) => rate.amount)) * MICROS_PER_USD), unit };
}

export function toVendor(schema: RunwareModelSchema): RunwareVendor | null {
  const creator = schema.info["x-creator"];

  return creator ? { id: creator.id, name: creator.name, logoUrl: creator.logo ?? null } : null;
}

export function toSyncUpdate(providerModelKey: string, schema: RunwareModelSchema | null): RunwareModelUpdate {
  if (!schema) return { providerModelKey, active: false, capabilities: null, cost: null, vendor: null };

  return {
    providerModelKey,
    active: schema.info["x-status"] === RUNWARE_LIVE_STATUS,
    capabilities: toCapabilities(schema),
    cost: toCost(schema),
    vendor: toVendor(schema),
  };
}
