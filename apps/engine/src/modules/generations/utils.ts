import { catalog } from "@/modules/catalog";
import type { ParseResult } from "@/shared/types";
import { isNonEmptyText, isOneOf, isRecord, isUuid, parseFailure, toIsoString } from "@/shared/utils";
import { GENERATION_ERRORS, GENERATION_KINDS, LIMITS, QUEUE } from "./constants";
import type { ProviderJob } from "./providers/types";
import type {
  CreateGenerationRequest,
  Generation,
  GenerationInput,
  GenerationRow,
  GenerationSettings,
  GenerationView,
} from "./types";

export function parseIdempotencyKey(value: unknown): ParseResult<string> {
  if (value === undefined) return parseFailure(GENERATION_ERRORS.missingKey);
  if (!isNonEmptyText(value, LIMITS.idempotencyKeyLength)) return parseFailure(GENERATION_ERRORS.invalidKey);

  return { ok: true, value: value.trim() };
}

function parsePrompt(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || value.length > LIMITS.promptLength) return undefined;

  return value.trim() || null;
}

function parseSettings(value: unknown): GenerationSettings | null {
  if (!isRecord(value)) return null;

  const { mode, resolution, aspectRatio, durationSeconds = null, audio = false } = value;

  if (
    !catalog.isGenerationMode(mode) ||
    !isNonEmptyText(resolution, LIMITS.settingLength) ||
    !isNonEmptyText(aspectRatio, LIMITS.settingLength)
  ) {
    return null;
  }
  if (durationSeconds !== null && !(Number.isInteger(durationSeconds) && Number(durationSeconds) > 0)) return null;
  if (typeof audio !== "boolean") return null;

  return { mode, resolution, aspectRatio, durationSeconds: durationSeconds as number | null, audio };
}

function parseInput(value: unknown): GenerationInput | null {
  if (!isRecord(value)) return null;

  const { assetId, role } = value;

  if (typeof assetId !== "string" || !isUuid(assetId) || !isNonEmptyText(role, LIMITS.roleLength)) return null;

  return { assetId, role: role.trim() };
}

function parseInputs(value: unknown): GenerationInput[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > LIMITS.inputs) return null;

  const inputs = value.map(parseInput);

  return inputs.every((input) => input !== null) ? inputs : null;
}

function parseTemplateId(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return null;

  return typeof value === "string" && isUuid(value) ? value : undefined;
}

/** A create request from the JSON body: `{ kind, prompt?, modelId, settings, inputs?, templateId? }`. */
export function parseCreateRequest(body: unknown): ParseResult<CreateGenerationRequest> {
  if (!isRecord(body)) return parseFailure(GENERATION_ERRORS.missingBody);

  const kind = body.kind;
  const prompt = parsePrompt(body.prompt);
  const modelId = body.modelId;
  const settings = parseSettings(body.settings);
  const inputs = parseInputs(body.inputs);
  const templateId = parseTemplateId(body.templateId);

  if (!isOneOf(GENERATION_KINDS, kind)) return parseFailure(GENERATION_ERRORS.invalidKind);
  if (prompt === undefined) return parseFailure(GENERATION_ERRORS.invalidPrompt);
  if (!isNonEmptyText(modelId, LIMITS.modelIdLength)) return parseFailure(GENERATION_ERRORS.invalidModel);
  if (!settings) return parseFailure(GENERATION_ERRORS.invalidSettings);
  if (!inputs) return parseFailure(GENERATION_ERRORS.invalidInputs);
  if (templateId === undefined) return parseFailure(GENERATION_ERRORS.invalidTemplate);
  if (kind === "edit" && !templateId) return parseFailure(GENERATION_ERRORS.editNeedsTemplate);
  if (kind === "create" && !prompt && !inputs.length) return parseFailure(GENERATION_ERRORS.nothingToGenerate);

  return { ok: true, value: { kind, prompt, modelId: modelId.trim(), settings, inputs, templateId } };
}

function toNullableIso(value: Date | string | null): string | null {
  return value === null ? null : toIsoString(value);
}

export function mapGenerationRow(row: GenerationRow): Generation {
  return {
    id: row.id,
    userId: row.user_id,
    idempotencyKey: row.idempotency_key,
    kind: row.kind,
    prompt: row.prompt,
    templateId: row.template_id,
    modelId: row.model_id,
    settings: row.settings,
    inputs: row.inputs,
    quote: row.quote,
    status: row.status,
    failureCode: row.failure_code,
    outputAssetId: row.output_asset_id,
    attempts: row.attempts,
    runAfter: toNullableIso(row.run_after),
    createdAt: toIsoString(row.created_at),
    completedAt: toNullableIso(row.completed_at),
  };
}

export function toGenerationView(generation: Generation): GenerationView {
  return {
    id: generation.id,
    kind: generation.kind,
    status: generation.status,
    prompt: generation.prompt,
    modelId: generation.modelId,
    settings: generation.settings,
    inputs: generation.inputs,
    templateId: generation.templateId,
    priceMicros: generation.quote.totalMicros,
    currency: generation.quote.currency,
    outputAssetId: generation.outputAssetId,
    failureCode: generation.failureCode,
    createdAt: generation.createdAt,
    completedAt: generation.completedAt,
  };
}

export function toProviderJob(generation: Generation): ProviderJob {
  return {
    generationId: generation.id,
    modelId: generation.modelId,
    prompt: generation.prompt,
    settings: generation.settings,
    inputs: generation.inputs,
  };
}

/** Seconds to wait before running a job again after its `attempt`-th try failed. */
export function retryDelaySeconds(attempt: number): number {
  const delays = QUEUE.retryDelaysSeconds;

  return delays[Math.min(Math.max(attempt, 1), delays.length) - 1];
}
