import { randomUUID } from "node:crypto";
import { publish, subscribe } from "@/infra/events";
import { logger } from "@/infra/logger";
import { billing } from "@/modules/billing";
import { type MediaKind, media, type OutputFile } from "@/modules/media";
import { pricing } from "@/modules/pricing";
import { templates } from "@/modules/templates";
import type { PageQuery } from "@/shared/types";
import { conflict, notFound, toPage, unprocessable } from "@/shared/utils";
import { FAILURE_CODES, GENERATION_ERRORS, GENERATION_EVENTS, QUEUE } from "./constants";
import type { GenerationProvider, ProviderResult } from "./providers/types";
import * as repository from "./repository";
import type {
  CreateGenerationRequest,
  Generation,
  GenerationFinished,
  GenerationInput,
  GenerationPage,
  GenerationView,
  TerminalStatus,
} from "./types";
import { retryDelaySeconds, toGenerationView, toProviderJob } from "./utils";

async function inputKinds(userId: string, inputs: GenerationInput[]): Promise<MediaKind[]> {
  const assets = await Promise.all(inputs.map((input) => media.getAsset(userId, input.assetId)));

  if (assets.some((asset) => asset.status !== "ready")) throw unprocessable(GENERATION_ERRORS.inputNotReady);

  return assets.map((asset) => asset.kind);
}

/** Hold the quoted price, then make the job due; a failed hold removes the unpaid job. */
async function admit(generation: Generation): Promise<Generation> {
  if (generation.runAfter) return generation;

  try {
    await billing.reserve({
      userId: generation.userId,
      generationId: generation.id,
      amountMicros: generation.quote.totalMicros,
    });
  } catch (error) {
    await repository.removeUnpaid(generation.id);
    throw error;
  }

  const due = await repository.markDue(generation.id);

  if (!due) throw conflict(GENERATION_ERRORS.retry);

  return due;
}

/**
 * Quote, record and queue a generation once its price is held. The same
 * idempotency key returns the generation it first created, at the price first quoted.
 */
export async function createGeneration(
  userId: string,
  idempotencyKey: string,
  request: CreateGenerationRequest,
): Promise<GenerationView> {
  const existing = await repository.findByIdempotencyKey(userId, idempotencyKey);

  if (existing) return toGenerationView(await admit(existing));

  const kinds = await inputKinds(userId, request.inputs);

  if (request.templateId) await templates.getTemplate(request.templateId);

  const quote = await pricing.calculateQuote({
    kind: request.kind,
    modelId: request.modelId,
    settings: { ...request.settings, inputs: kinds },
    templateId: request.templateId,
    quantity: 1,
  });

  const created =
    (await repository.insert({
      id: randomUUID(),
      userId,
      idempotencyKey,
      kind: request.kind,
      prompt: request.prompt,
      templateId: request.templateId,
      modelId: quote.modelId,
      settings: request.settings,
      inputs: request.inputs,
      quote,
    })) ?? (await repository.findByIdempotencyKey(userId, idempotencyKey));

  if (!created) throw conflict(GENERATION_ERRORS.retry);

  return toGenerationView(await admit(created));
}

export async function listGenerations(userId: string, query: PageQuery): Promise<GenerationPage> {
  const page = toPage(await repository.listForUser(userId, query.limit + 1, query.cursor), query.limit);

  return { generations: page.items.map(toGenerationView), nextCursor: page.nextCursor };
}

/** One of the user's generations; another user's is reported as not found. */
export async function getGeneration(userId: string, generationId: string): Promise<GenerationView> {
  const generation = await repository.findForUser(userId, generationId);

  if (!generation) throw notFound(GENERATION_ERRORS.notFound);

  return toGenerationView(generation);
}

function announce(generation: Generation, status: TerminalStatus): void {
  publish<GenerationFinished>(GENERATION_EVENTS.finished, {
    generationId: generation.id,
    userId: generation.userId,
    status,
    failureCode: generation.failureCode,
  });
}

async function succeed(job: Generation, output: OutputFile): Promise<void> {
  const asset = await media.registerOutput(job.userId, output);
  const done = await repository.finish(job.id, job.attempts, {
    status: "succeeded",
    failureCode: null,
    outputAssetId: asset.id,
  });

  if (!done) return;

  await billing.capture(job.id);
  announce(done, "succeeded");
}

async function fail(job: Generation, failureCode: string): Promise<void> {
  const done = await repository.finish(job.id, job.attempts, { status: "failed", failureCode, outputAssetId: null });

  if (!done) return;

  await billing.release(job.id);
  announce(done, "failed");
}

async function render(provider: GenerationProvider, job: Generation): Promise<ProviderResult> {
  try {
    return await provider.run(toProviderJob(job));
  } catch (error) {
    logger.warn({ err: error, generationId: job.id, provider: provider.name }, "Provider run failed");

    return { ok: false, code: FAILURE_CODES.providerError, retryable: true };
  }
}

/**
 * Claim one due job and carry it to its next state: succeeded and charged,
 * queued again for a retry, or failed and refunded. False when nothing is due.
 */
export async function processNextJob(provider: GenerationProvider): Promise<boolean> {
  const job = await repository.claimNext(QUEUE.leaseSeconds);

  if (!job) return false;

  if (job.attempts > QUEUE.maxAttempts) {
    await fail(job, FAILURE_CODES.attemptsExhausted);
    return true;
  }

  const result = await render(provider, job);

  if (result.ok) {
    await succeed(job, result.output);
  } else if (result.retryable && job.attempts < QUEUE.maxAttempts) {
    await repository.requeue(job.id, job.attempts, retryDelaySeconds(job.attempts));
  } else {
    await fail(job, result.code);
  }

  return true;
}

/** Run `handler` whenever a generation succeeds or fails; returns a function that stops listening. */
export function onFinished(handler: (event: GenerationFinished) => Promise<void> | void): () => void {
  return subscribe(GENERATION_EVENTS.finished, handler);
}
