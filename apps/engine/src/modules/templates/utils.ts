import type { AssetView } from "@/modules/media";
import { isRecord, toIsoString } from "@/shared/utils";
import type { CustomizationOptions, Template, TemplateRow, TemplateView } from "./types";

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item !== "") : [];
}

function secondsList(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number" && Number.isInteger(item) && item > 0)
    : [];
}

/** Customisation options from the stored jsonb, keeping only well-formed lists. */
export function parseCustomizationOptions(value: unknown): CustomizationOptions {
  const options: Record<string, unknown> = isRecord(value) ? value : {};

  return {
    roles: stringList(options.roles),
    resolutions: stringList(options.resolutions),
    durationsSeconds: secondsList(options.durations_seconds),
    aspectRatios: stringList(options.aspect_ratios),
  };
}

export function mapTemplateRow(row: TemplateRow): Template {
  return {
    id: row.id,
    sourceAssetId: row.source_asset_id,
    name: row.name,
    customizationOptions: parseCustomizationOptions(row.customization_options),
    createdAt: toIsoString(row.created_at),
  };
}

function toTemplateView(template: Template, source: AssetView): TemplateView {
  return {
    id: template.id,
    name: template.name,
    source,
    customizationOptions: template.customizationOptions,
    createdAt: template.createdAt,
  };
}

/** Pair each template with its source; one whose source is missing is left out. */
export function pairWithSources(templates: Template[], sources: AssetView[]): TemplateView[] {
  const sourceById = new Map(sources.map((source) => [source.id, source]));

  return templates.flatMap((template) => {
    const source = sourceById.get(template.sourceAssetId);

    return source ? [toTemplateView(template, source)] : [];
  });
}
