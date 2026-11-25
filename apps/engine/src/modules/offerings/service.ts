import { catalog } from "@/modules/catalog";
import { pricing } from "@/modules/pricing";
import type { Offering } from "./types";
import { buildOfferings } from "./utils";

export async function listOfferings(mode?: string): Promise<Offering[]> {
  const models = await catalog.listActiveModels(mode);
  const rates = await pricing.listRates(models);

  return buildOfferings(models, rates);
}
