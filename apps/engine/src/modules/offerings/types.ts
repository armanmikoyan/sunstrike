import type { CatalogModel } from "@/modules/catalog";
import type { PricingRate } from "@/modules/pricing";

export type OfferingModel = Pick<CatalogModel, "id" | "slug" | "name" | "summary" | "vendor" | "capabilities">;

export type OfferingPrice = Omit<PricingRate, "modelId">;

/** A model a customer can use now: catalog details paired with its selling price. */
export interface Offering {
  model: OfferingModel;
  price: OfferingPrice;
}

export interface ListOfferingsQuery {
  mode?: unknown;
}
