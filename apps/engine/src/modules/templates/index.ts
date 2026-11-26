import * as service from "./service";

/** Curated templates: a shared source asset and the options a user may change. */
export const templates = {
  getTemplate: service.getTemplate,
};

export type { CustomizationOptions, TemplateView } from "./types";
