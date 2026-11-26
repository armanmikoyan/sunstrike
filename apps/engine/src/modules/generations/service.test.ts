import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Quote } from "@/modules/pricing";
import type { GenerationProvider } from "./providers/types";
import type { CreateGenerationRequest, Generation } from "./types";

const repositoryMock = vi.hoisted(() => ({
  insert: vi.fn(),
  findByIdempotencyKey: vi.fn(),
  findForUser: vi.fn(),
  listForUser: vi.fn(),
  markDue: vi.fn(),
  removeUnpaid: vi.fn(),
  claimNext: vi.fn(),
  requeue: vi.fn(),
  finish: vi.fn(),
}));
const billingMock = vi.hoisted(() => ({ reserve: vi.fn(), capture: vi.fn(), release: vi.fn() }));
const mediaMock = vi.hoisted(() => ({ getAsset: vi.fn(), registerOutput: vi.fn() }));
const pricingMock = vi.hoisted(() => ({ calculateQuote: vi.fn() }));
const templatesMock = vi.hoisted(() => ({ getTemplate: vi.fn() }));
const eventsMock = vi.hoisted(() => ({ publish: vi.fn(), subscribe: vi.fn() }));

vi.mock("./repository", () => repositoryMock);
vi.mock("@/modules/billing", () => ({ billing: billingMock }));
vi.mock("@/modules/media", () => ({ media: mediaMock }));
vi.mock("@/modules/pricing", () => ({ pricing: pricingMock }));
vi.mock("@/modules/templates", () => ({ templates: templatesMock }));
vi.mock("@/infra/events", () => eventsMock);
vi.mock("@/infra/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));

import * as service from "./service";

const USER = "11111111-1111-4111-8111-111111111111";
const ASSET = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const MODEL = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const OUTPUT = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const KEY = "key-1";

const settings = { mode: "video", resolution: "720p", aspectRatio: "16:9", durationSeconds: 5, audio: false } as const;

const request: CreateGenerationRequest = {
  kind: "create",
  prompt: "a lighthouse",
  modelId: "runware:kling",
  settings,
  inputs: [{ assetId: ASSET, role: "subject" }],
  templateId: null,
};

const quote = { modelId: MODEL, totalMicros: 510_000, currency: "USD" } as Quote;

const pending: Generation = {
  id: "99999999-9999-4999-8999-999999999999",
  userId: USER,
  idempotencyKey: KEY,
  kind: "create",
  prompt: "a lighthouse",
  templateId: null,
  modelId: MODEL,
  settings,
  inputs: request.inputs,
  quote,
  status: "queued",
  failureCode: null,
  outputAssetId: null,
  attempts: 0,
  runAfter: null,
  createdAt: "2026-11-26T09:00:00.000Z",
  completedAt: null,
};

const due: Generation = { ...pending, runAfter: "2026-11-26T09:00:01.000Z" };
const claimed: Generation = { ...due, status: "running", attempts: 1 };

function provider(run: GenerationProvider["run"]): GenerationProvider {
  return { name: "test", run };
}

describe("generation service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repositoryMock.findByIdempotencyKey.mockResolvedValue(null);
    repositoryMock.insert.mockResolvedValue(pending);
    repositoryMock.markDue.mockResolvedValue(due);
    mediaMock.getAsset.mockResolvedValue({ id: ASSET, kind: "image", status: "ready" });
    pricingMock.calculateQuote.mockResolvedValue(quote);
  });

  describe("createGeneration", () => {
    it("quotes with the input kinds, records the job, holds the price and makes it due", async () => {
      const view = await service.createGeneration(USER, KEY, request);

      expect(pricingMock.calculateQuote).toHaveBeenCalledWith({
        kind: "create",
        modelId: "runware:kling",
        settings: { ...settings, inputs: ["image"] },
        templateId: null,
        quantity: 1,
      });
      expect(repositoryMock.insert).toHaveBeenCalledWith(
        expect.objectContaining({ userId: USER, idempotencyKey: KEY, modelId: MODEL, quote }),
      );
      expect(billingMock.reserve).toHaveBeenCalledWith({
        userId: USER,
        generationId: pending.id,
        amountMicros: 510_000,
      });
      expect(repositoryMock.markDue).toHaveBeenCalledWith(pending.id);
      expect(view).toMatchObject({ id: pending.id, status: "queued", priceMicros: 510_000, currency: "USD" });
    });

    it("returns the first generation for a repeated key without quoting again", async () => {
      repositoryMock.findByIdempotencyKey.mockResolvedValue(due);

      await service.createGeneration(USER, KEY, request);

      expect(pricingMock.calculateQuote).not.toHaveBeenCalled();
      expect(billingMock.reserve).not.toHaveBeenCalled();
    });

    it("finishes admitting a repeated key whose price was never held", async () => {
      repositoryMock.findByIdempotencyKey.mockResolvedValue(pending);

      await service.createGeneration(USER, KEY, request);

      expect(pricingMock.calculateQuote).not.toHaveBeenCalled();
      expect(billingMock.reserve).toHaveBeenCalledOnce();
    });

    it("removes the unpaid job when the price cannot be held", async () => {
      billingMock.reserve.mockRejectedValue({ status: 402 });

      await expect(service.createGeneration(USER, KEY, request)).rejects.toMatchObject({ status: 402 });
      expect(repositoryMock.removeUnpaid).toHaveBeenCalledWith(pending.id);
      expect(repositoryMock.markDue).not.toHaveBeenCalled();
    });

    it("answers 422 when an input is still uploading", async () => {
      mediaMock.getAsset.mockResolvedValue({ id: ASSET, kind: "image", status: "pending" });

      await expect(service.createGeneration(USER, KEY, request)).rejects.toMatchObject({ status: 422 });
      expect(repositoryMock.insert).not.toHaveBeenCalled();
    });

    it("checks the template exists before quoting", async () => {
      templatesMock.getTemplate.mockRejectedValue({ status: 404 });

      await expect(
        service.createGeneration(USER, KEY, { ...request, templateId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }),
      ).rejects.toMatchObject({ status: 404 });
      expect(pricingMock.calculateQuote).not.toHaveBeenCalled();
    });
  });

  it("reports another user's generation as not found", async () => {
    repositoryMock.findForUser.mockResolvedValue(null);

    await expect(service.getGeneration(USER, pending.id)).rejects.toMatchObject({ status: 404 });
  });

  describe("processNextJob", () => {
    it("reports an empty queue", async () => {
      repositoryMock.claimNext.mockResolvedValue(null);

      await expect(service.processNextJob(provider(vi.fn()))).resolves.toBe(false);
    });

    it("stores the output, charges the hold and announces success", async () => {
      const output = { contentType: "image/png", body: Buffer.from("png") };
      repositoryMock.claimNext.mockResolvedValue(claimed);
      mediaMock.registerOutput.mockResolvedValue({ id: OUTPUT });
      repositoryMock.finish.mockResolvedValue({ ...claimed, status: "succeeded", outputAssetId: OUTPUT });

      await expect(service.processNextJob(provider(async () => ({ ok: true, output })))).resolves.toBe(true);

      expect(mediaMock.registerOutput).toHaveBeenCalledWith(USER, output);
      expect(repositoryMock.finish).toHaveBeenCalledWith(claimed.id, 1, {
        status: "succeeded",
        failureCode: null,
        outputAssetId: OUTPUT,
      });
      expect(billingMock.capture).toHaveBeenCalledWith(claimed.id);
      expect(eventsMock.publish).toHaveBeenCalledWith("generation.finished", {
        generationId: claimed.id,
        userId: USER,
        status: "succeeded",
        failureCode: null,
      });
    });

    it("queues a retryable failure again", async () => {
      repositoryMock.claimNext.mockResolvedValue(claimed);

      await service.processNextJob(provider(async () => ({ ok: false, code: "busy", retryable: true })));

      expect(repositoryMock.requeue).toHaveBeenCalledWith(claimed.id, 1, 30);
      expect(billingMock.release).not.toHaveBeenCalled();
    });

    it("fails and refunds a job on its last attempt", async () => {
      const last = { ...claimed, attempts: 3 };
      repositoryMock.claimNext.mockResolvedValue(last);
      repositoryMock.finish.mockResolvedValue({ ...last, status: "failed", failureCode: "provider_error" });

      await service.processNextJob(
        provider(async () => {
          throw new Error("timeout");
        }),
      );

      expect(repositoryMock.finish).toHaveBeenCalledWith(last.id, 3, {
        status: "failed",
        failureCode: "provider_error",
        outputAssetId: null,
      });
      expect(billingMock.release).toHaveBeenCalledWith(last.id);
      expect(eventsMock.publish).toHaveBeenCalledWith(
        "generation.finished",
        expect.objectContaining({ status: "failed", failureCode: "provider_error" }),
      );
    });

    it("fails a reclaimed job past its attempts without running it", async () => {
      const run = vi.fn();
      repositoryMock.claimNext.mockResolvedValue({ ...claimed, attempts: 4 });
      repositoryMock.finish.mockResolvedValue({ ...claimed, status: "failed", failureCode: "attempts_exhausted" });

      await service.processNextJob(provider(run));

      expect(run).not.toHaveBeenCalled();
      expect(billingMock.release).toHaveBeenCalledWith(claimed.id);
    });

    it("leaves settlement to the worker that holds the job now", async () => {
      repositoryMock.claimNext.mockResolvedValue(claimed);
      repositoryMock.finish.mockResolvedValue(null);

      await service.processNextJob(provider(async () => ({ ok: false, code: "bad_prompt", retryable: false })));

      expect(billingMock.release).not.toHaveBeenCalled();
      expect(eventsMock.publish).not.toHaveBeenCalled();
    });
  });
});
