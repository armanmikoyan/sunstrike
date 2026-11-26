export const GENERATION_KINDS = ["create", "edit"] as const;

export const GENERATION_STATUS = {
  queued: "queued",
  running: "running",
  succeeded: "succeeded",
  failed: "failed",
} as const;

export const IDEMPOTENCY_HEADER = "idempotency-key";

export const LIMITS = {
  idempotencyKeyLength: 200,
  promptLength: 4000,
  modelIdLength: 200,
  settingLength: 40,
  inputs: 8,
  roleLength: 40,
} as const;

/** A claimed job's lease, how often it may run, and the wait before each retry. */
export const QUEUE = {
  leaseSeconds: 300,
  maxAttempts: 3,
  retryDelaysSeconds: [30, 120],
  idleDelayMs: 2000,
} as const;

export const FAILURE_CODES = {
  providerError: "provider_error",
  attemptsExhausted: "attempts_exhausted",
} as const;

export const GENERATION_EVENTS = { finished: "generation.finished" } as const;

export const GENERATION_ERRORS = {
  notFound: "Generation not found.",
  missingKey: "Send an Idempotency-Key header so a retried request is never charged twice.",
  invalidKey: `Idempotency-Key must be 1 to ${LIMITS.idempotencyKeyLength} characters.`,
  missingBody: "Send kind, modelId and settings.",
  invalidKind: "kind must be create or edit.",
  invalidPrompt: `prompt must be text of up to ${LIMITS.promptLength} characters.`,
  invalidModel: "modelId must be a model id or slug.",
  invalidSettings:
    "settings needs mode (video or image), resolution and aspectRatio; durationSeconds and audio are optional.",
  invalidInputs: `inputs must be up to ${LIMITS.inputs} items of { assetId, role }.`,
  invalidTemplate: "templateId must be a template id.",
  editNeedsTemplate: "An edit starts from a template; send templateId.",
  nothingToGenerate: "Send a prompt or at least one input.",
  inputNotReady: "Every input must be an asset that has finished uploading.",
  retry: "The generation could not be recorded. Retry with the same Idempotency-Key.",
} as const;
