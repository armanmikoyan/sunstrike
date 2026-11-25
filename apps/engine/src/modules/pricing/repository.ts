import { query } from "@/infra/database";
import type { ModelPrice, ModelPriceRow } from "./types";
import { mapPriceRow } from "./utils";

const columns = `
  id,
  model_id,
  unit_price_micros,
  pricing_rules,
  active,
  updated_at
`;

export async function listActiveByModelIds(modelIds: readonly string[]): Promise<ModelPrice[]> {
  const rows = await query<ModelPriceRow>(
    `select ${columns}
     from model_prices
     where active = true and model_id = any($1::uuid[])`,
    [modelIds],
  );

  return rows.map(mapPriceRow);
}

export async function findActiveByModelId(modelId: string): Promise<ModelPrice | null> {
  const rows = await query<ModelPriceRow>(
    `select ${columns}
     from model_prices
     where active = true and model_id = $1`,
    [modelId],
  );

  return rows[0] ? mapPriceRow(rows[0]) : null;
}
