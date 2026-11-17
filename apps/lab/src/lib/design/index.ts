/**
 * The product contract, taken from the high-level design (sections 02 and 03).
 *
 * Every field in this file exists in the diagram. Nothing else may be shown as
 * a product field: if a screen needs data that is not here, the design has to
 * grow first. `GenerationSettings` is the shape stored in `generations.settings`
 * and validated against `GenerationModelCapabilities`.
 */

export type MediaKind = "image" | "video" | "audio";
export type GenerationKind = "create" | "edit";
export type GenerationStatus = "queued" | "running" | "succeeded" | "failed";

/** The two studio surfaces the UI exposes. A model declares which it supports. */
export type GenerationMode = "video" | "image";

/** 02 Core entities — `users`. */
export type User = {
  id: string;
  email: string;
  createdAt: string;
};

/** 02 Core entities — `media_assets`. Nullable owner for shared assets. */
export type MediaAsset = {
  id: string;
  ownerUserId: string | null;
  kind: MediaKind;
  storageKey: string;
  createdAt: string;
};

/** 02 Core entities — `templates`. */
export type Template = {
  id: string;
  sourceAssetId: string;
  name: string;
  customizationOptions: Record<string, unknown>;
  createdAt: string;
};

/** The `generations.settings` jsonb payload. */
export type GenerationSettings = {
  resolution: string;
  duration: string | null;
  aspectRatio: string;
  audio: boolean;
};

/** 02 Core entities — `generations`. */
export type Generation = {
  id: string;
  userId: string;
  templateId: string | null;
  outputAssetId: string | null;
  kind: GenerationKind;
  prompt: string | null;
  model: string;
  settings: GenerationSettings;
  status: GenerationStatus;
  failureCode: string | null;
  createdAt: string;
  completedAt: string | null;
};

/** 02 Core entities — `generation_models.capabilities`. */
export type GenerationModelCapabilities = {
  modes: GenerationMode[];
  inputs: MediaKind[];
  resolutions: string[];
  durations: string[];
  aspectRatios: string[];
  audio: boolean;
};

/** 02 Core entities — `generation_models`. */
export type GenerationModel = {
  id: string;
  slug: string;
  displayName: string;
  provider: string;
  providerModelId: string;
  capabilities: GenerationModelCapabilities;
  isEnabled: boolean;
};

/** 02 Core entities — `notifications`. */
export type Notification = {
  id: string;
  generationId: string;
  type: string;
  readAt: string | null;
  createdAt: string;
};

/**
 * 02 names "Balance transaction" but draws no table. This is the smallest shape
 * the entity description ("a top-up, generation charge, or credit") needs.
 * It is recorded as an open decision in ROADMAP.md.
 */
export type BalanceTransaction = {
  id: string;
  userId: string;
  kind: "top_up" | "charge" | "credit";
  amount: number;
  generationId: string | null;
  createdAt: string;
};

/** 03 API design — `POST /api/v1/generations` body. */
export type GenerationInput = {
  assetId: string;
  role: string;
};

export type GenerationRequest = {
  kind: GenerationKind;
  prompt?: string;
  inputs?: GenerationInput[];
  templateId?: string;
  model: string;
  settings: GenerationSettings;
};

export type GenerationAccepted = {
  id: string;
  status: "queued";
};

export type GenerationResult = {
  id: string;
  status: GenerationStatus;
  outputAssetId?: string;
  failureCode?: string;
};

export type GenerationList = {
  items: GenerationResult[];
  nextCursor: string | null;
};

export type MediaAssetUploadRequest = {
  filename: string;
  contentType: string;
  sizeBytes: number;
};

export type MediaAssetUpload = {
  assetId: string;
  uploadUrl: string;
};

export type MediaAssetDetail = MediaAsset & {
  signedUrl: string;
};

export type TemplateList = {
  items: Template[];
  nextCursor: string | null;
};

export type Balance = {
  available: number;
  currency: "USD";
};

export type TopUpRequest = {
  amount: number;
  currency: "USD";
};

export type TopUp = {
  id: string;
  checkoutUrl: string;
};

export type GenerationQuoteRequest = {
  kind: GenerationKind;
  model: string;
  settings: GenerationSettings;
  templateId?: string;
};

export type GenerationQuote = {
  amount: number;
  currency: "USD";
};

export type ModelList = {
  items: GenerationModel[];
};

/** 03 API design — the complete surface. Paths are relative to the API origin. */
export const API_PATHS = {
  me: "/api/v1/me",
  generations: "/api/v1/generations",
  generation: (id: string) => `/api/v1/generations/${id}`,
  assetUploads: "/api/v1/assets/uploads",
  assetComplete: (id: string) => `/api/v1/assets/${id}/complete`,
  asset: (id: string) => `/api/v1/assets/${id}`,
  templates: "/api/v1/templates",
  template: (id: string) => `/api/v1/templates/${id}`,
  balance: "/api/v1/balance",
  topUps: "/api/v1/balance/top-ups",
  generationQuotes: "/api/v1/generation-quotes",
  notifications: "/api/v1/notifications",
  notification: (id: string) => `/api/v1/notifications/${id}`,
  models: "/api/v1/models",
} as const;

/** `settings` are valid only when the selected model advertises each value. */
export function modelSupportsSettings(
  model: GenerationModel,
  settings: GenerationSettings,
) {
  const { capabilities } = model;
  return (
    capabilities.aspectRatios.includes(settings.aspectRatio) &&
    capabilities.resolutions.includes(settings.resolution) &&
    (settings.duration === null ||
      capabilities.durations.includes(settings.duration)) &&
    (!settings.audio || capabilities.audio)
  );
}
