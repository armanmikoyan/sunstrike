import * as service from "./service";

/** Models a customer can use now, with their options and selling price. */
export const offerings = {
  listOfferings: service.listOfferings,
};

export type { Offering, OfferingModel, OfferingPrice } from "./types";
