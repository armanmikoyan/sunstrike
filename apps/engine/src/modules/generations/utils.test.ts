import { describe, expect, it } from "vitest";
import { GENERATION_ERRORS } from "./constants";
import { parseCreateRequest, parseIdempotencyKey, retryDelaySeconds } from "./utils";

const ASSET = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TEMPLATE = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const body = {
  kind: "create",
  prompt: "  a lighthouse at dusk  ",
  modelId: "runware:kling",
  settings: { mode: "video", resolution: "720p", aspectRatio: "16:9", durationSeconds: 5 },
};

describe("parseIdempotencyKey", () => {
  it("requires the header", () => {
    expect(parseIdempotencyKey(undefined)).toEqual({ ok: false, message: GENERATION_ERRORS.missingKey });
  });

  it("rejects blank and oversized keys", () => {
    expect(parseIdempotencyKey(" ").ok).toBe(false);
    expect(parseIdempotencyKey("k".repeat(201)).ok).toBe(false);
  });

  it("trims a valid key", () => {
    expect(parseIdempotencyKey(" key-1 ")).toEqual({ ok: true, value: "key-1" });
  });
});

describe("parseCreateRequest", () => {
  it("reads a create request and fills the optional fields", () => {
    expect(parseCreateRequest(body)).toEqual({
      ok: true,
      value: {
        kind: "create",
        prompt: "a lighthouse at dusk",
        modelId: "runware:kling",
        settings: { mode: "video", resolution: "720p", aspectRatio: "16:9", durationSeconds: 5, audio: false },
        inputs: [],
        templateId: null,
      },
    });
  });

  it("keeps inputs with their roles", () => {
    const parsed = parseCreateRequest({ ...body, inputs: [{ assetId: ASSET, role: " subject " }] });

    expect(parsed.ok && parsed.value.inputs).toEqual([{ assetId: ASSET, role: "subject" }]);
  });

  it.each([
    [{ ...body, kind: "remix" }, GENERATION_ERRORS.invalidKind],
    [{ ...body, prompt: 5 }, GENERATION_ERRORS.invalidPrompt],
    [{ ...body, modelId: "" }, GENERATION_ERRORS.invalidModel],
    [{ ...body, settings: { ...body.settings, mode: "audio" } }, GENERATION_ERRORS.invalidSettings],
    [{ ...body, settings: { ...body.settings, durationSeconds: 2.5 } }, GENERATION_ERRORS.invalidSettings],
    [{ ...body, inputs: [{ assetId: "nope", role: "subject" }] }, GENERATION_ERRORS.invalidInputs],
    [{ ...body, templateId: "nope" }, GENERATION_ERRORS.invalidTemplate],
    [{ ...body, kind: "edit" }, GENERATION_ERRORS.editNeedsTemplate],
    [{ ...body, prompt: "   " }, GENERATION_ERRORS.nothingToGenerate],
  ])("rejects %o", (input, message) => {
    expect(parseCreateRequest(input)).toEqual({ ok: false, message });
  });

  it("accepts an edit from a template without a prompt", () => {
    expect(parseCreateRequest({ ...body, kind: "edit", prompt: null, templateId: TEMPLATE }).ok).toBe(true);
  });

  it("rejects a missing body", () => {
    expect(parseCreateRequest(undefined)).toEqual({ ok: false, message: GENERATION_ERRORS.missingBody });
  });
});

describe("retryDelaySeconds", () => {
  it("waits longer after each attempt and holds at the last delay", () => {
    expect(retryDelaySeconds(1)).toBe(30);
    expect(retryDelaySeconds(2)).toBe(120);
    expect(retryDelaySeconds(9)).toBe(120);
  });
});
