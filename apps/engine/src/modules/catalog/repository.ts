import { query } from "@/infra/database";
import type { CatalogModelWithCost, ModelRow, UpsertProviderModelInput } from "./types";
import { mapModelRow } from "./utils";

const columns = `
  id,
  slug,
  name,
  summary,
  provider,
  provider_model_key,
  vendor_id,
  vendor_name,
  vendor_logo_url,
  supported_modes,
  supported_inputs,
  resolutions,
  durations_seconds,
  aspect_ratios,
  supports_audio,
  provider_cost_micros,
  provider_cost_unit,
  sort_order,
  active,
  updated_at
`;

export async function listActive(): Promise<CatalogModelWithCost[]> {
  const rows = await query<ModelRow>(
    `select ${columns}
     from generation_models
     where active = true
     order by sort_order asc, name asc`,
  );

  return rows.map(mapModelRow);
}

export async function listAll(): Promise<CatalogModelWithCost[]> {
  const rows = await query<ModelRow>(
    `select ${columns}
     from generation_models
     order by sort_order asc, name asc`,
  );

  return rows.map(mapModelRow);
}

export async function findById(id: string): Promise<CatalogModelWithCost | null> {
  const rows = await query<ModelRow>(`select ${columns} from generation_models where id = $1`, [id]);

  return rows[0] ? mapModelRow(rows[0]) : null;
}

export async function findBySlug(slug: string): Promise<CatalogModelWithCost | null> {
  const rows = await query<ModelRow>(`select ${columns} from generation_models where slug = $1`, [slug]);

  return rows[0] ? mapModelRow(rows[0]) : null;
}

export async function setActive(id: string, active: boolean): Promise<CatalogModelWithCost | null> {
  const rows = await query<ModelRow>(
    `update generation_models
     set active = $2, updated_at = now()
     where id = $1
     returning ${columns}`,
    [id, active],
  );

  return rows[0] ? mapModelRow(rows[0]) : null;
}

export async function upsertProviderModel(input: UpsertProviderModelInput): Promise<CatalogModelWithCost> {
  const rows = await query<ModelRow>(
    `insert into generation_models (
       slug,
       name,
       summary,
       provider,
       provider_model_key,
       vendor_id,
       vendor_name,
       vendor_logo_url,
       supported_modes,
       supported_inputs,
       resolutions,
       durations_seconds,
       aspect_ratios,
       supports_audio,
       provider_cost_micros,
       provider_cost_unit,
       sort_order,
       active,
       updated_at
     )
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, now())
     on conflict (provider, provider_model_key) do update set
       slug = excluded.slug,
       name = excluded.name,
       summary = excluded.summary,
       vendor_id = excluded.vendor_id,
       vendor_name = excluded.vendor_name,
       vendor_logo_url = excluded.vendor_logo_url,
       supported_modes = excluded.supported_modes,
       supported_inputs = excluded.supported_inputs,
       resolutions = excluded.resolutions,
       durations_seconds = excluded.durations_seconds,
       aspect_ratios = excluded.aspect_ratios,
       supports_audio = excluded.supports_audio,
       provider_cost_micros = excluded.provider_cost_micros,
       provider_cost_unit = excluded.provider_cost_unit,
       active = excluded.active,
       updated_at = now()
     returning ${columns}`,
    [
      input.slug,
      input.name,
      input.summary ?? "",
      input.provider,
      input.providerModelKey,
      input.vendor?.id ?? null,
      input.vendor?.name ?? null,
      input.vendor?.logoUrl ?? null,
      input.capabilities.modes,
      input.capabilities.inputs,
      input.capabilities.resolutions,
      input.capabilities.durationsSeconds,
      input.capabilities.aspectRatios,
      input.capabilities.audio,
      input.providerCostMicros,
      input.providerCostUnit,
      input.sortOrder ?? 0,
      input.active ?? true,
    ],
  );

  const row = rows[0];

  if (!row) throw new Error(`Failed to upsert model "${input.slug}"`);

  return mapModelRow(row);
}
