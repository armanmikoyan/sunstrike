import type { AssetView } from "@/modules/media";

/** What a user may change before generating from a template. */
export interface CustomizationOptions {
  roles: string[];
  resolutions: string[];
  durationsSeconds: number[];
  aspectRatios: string[];
}

export interface Template {
  id: string;
  sourceAssetId: string;
  name: string;
  customizationOptions: CustomizationOptions;
  createdAt: string;
}

export interface TemplateRow {
  id: string;
  source_asset_id: string;
  name: string;
  customization_options: unknown;
  created_at: Date | string;
}

/** A template as the API returns it, with its source preview signed for a few minutes. */
export interface TemplateView {
  id: string;
  name: string;
  source: AssetView;
  customizationOptions: CustomizationOptions;
  createdAt: string;
}

export interface TemplatePage {
  templates: TemplateView[];
  nextCursor: string | null;
}
