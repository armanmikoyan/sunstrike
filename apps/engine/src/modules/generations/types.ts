import type { GenerationMode } from "@/modules/catalog";
import type { Quote } from "@/modules/pricing";
import type { GENERATION_KINDS, GENERATION_STATUS } from "./constants";

export type GenerationKind = (typeof GENERATION_KINDS)[number];

export type GenerationStatus = (typeof GENERATION_STATUS)[keyof typeof GENERATION_STATUS];

export type TerminalStatus = Extract<GenerationStatus, "succeeded" | "failed">;

/** An uploaded asset the generation starts from, and the part it plays, such as `subject`. */
export interface GenerationInput {
  assetId: string;
  role: string;
}

export interface GenerationSettings {
  mode: GenerationMode;
  resolution: string;
  aspectRatio: string;
  durationSeconds: number | null;
  audio: boolean;
}

export interface CreateGenerationRequest {
  kind: GenerationKind;
  prompt: string | null;
  modelId: string;
  settings: GenerationSettings;
  inputs: GenerationInput[];
  templateId: string | null;
}

export interface Generation {
  id: string;
  userId: string;
  idempotencyKey: string;
  kind: GenerationKind;
  prompt: string | null;
  templateId: string | null;
  modelId: string;
  settings: GenerationSettings;
  inputs: GenerationInput[];
  quote: Quote;
  status: GenerationStatus;
  failureCode: string | null;
  outputAssetId: string | null;
  attempts: number;
  runAfter: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface GenerationRow {
  id: string;
  user_id: string;
  idempotency_key: string;
  kind: GenerationKind;
  prompt: string | null;
  template_id: string | null;
  model_id: string;
  settings: GenerationSettings;
  inputs: GenerationInput[];
  quote: Quote;
  status: GenerationStatus;
  failure_code: string | null;
  output_asset_id: string | null;
  attempts: number;
  run_after: Date | string | null;
  created_at: Date | string;
  completed_at: Date | string | null;
}

export type NewGeneration = Pick<
  Generation,
  "id" | "userId" | "idempotencyKey" | "kind" | "prompt" | "templateId" | "modelId" | "settings" | "inputs" | "quote"
>;

export interface Outcome {
  status: TerminalStatus;
  failureCode: string | null;
  outputAssetId: string | null;
}

/** A generation as the API returns it; the price is the accepted quote, never recalculated. */
export interface GenerationView {
  id: string;
  kind: GenerationKind;
  status: GenerationStatus;
  prompt: string | null;
  modelId: string;
  settings: GenerationSettings;
  inputs: GenerationInput[];
  templateId: string | null;
  priceMicros: number;
  currency: Quote["currency"];
  outputAssetId: string | null;
  failureCode: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface GenerationPage {
  generations: GenerationView[];
  nextCursor: string | null;
}

/** Published once, when a generation reaches a terminal status. */
export interface GenerationFinished {
  generationId: string;
  userId: string;
  status: TerminalStatus;
  failureCode: string | null;
}
