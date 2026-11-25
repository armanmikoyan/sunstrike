import { describe, expect, it } from "vitest";
import type { RunwareModelSchema, RunwareTaskSchema } from "./types";
import { durationOptions, inputKinds, sizePresets, toCapabilities, toCost, toSyncUpdate, toVendor } from "./utils";

function schema(info: Partial<RunwareModelSchema["info"]>, task: RunwareTaskSchema = {}): RunwareModelSchema {
  return {
    info: { "x-air-id": "vendor:model@1", "x-status": "live", "x-capabilities": [], ...info },
    components: { schemas: { RequestBody: { items: task } } },
  };
}

const preset = (title: string) => ({ title, properties: {} });

const seedance = schema(
  {
    "x-capabilities": ["text-to-video", "image-to-video", "video-to-video", "edit", "audio"],
    "x-pricing": {
      currency: "USD",
      rates: [
        { amount: 0.07393, unit: "durationSecond", label: "480p" },
        { amount: 0.15899, unit: "durationSecond", label: "720p" },
      ],
    },
  },
  {
    properties: {
      inputs: { properties: { referenceImages: {}, frameImages: {}, referenceVideos: {}, referenceAudios: {} } },
      resolution: { type: "string", enum: ["480p", "720p"] },
      duration: { type: "integer", minimum: 4, maximum: 7 },
    },
    allOf: [
      { dependentRequired: { width: ["height"] } },
      { oneOf: [preset("480p (16:9)"), preset("480p (9:16)"), preset("720p (16:9)"), preset("720p (1:1)")] },
    ],
  },
);

describe("runware utils", () => {
  it("reads resolution and aspect ratio from size preset titles", () => {
    expect(sizePresets(seedance.components.schemas.RequestBody.items.allOf)).toEqual([
      { resolution: "480p", aspectRatio: "16:9" },
      { resolution: "480p", aspectRatio: "9:16" },
      { resolution: "720p", aspectRatio: "16:9" },
      { resolution: "720p", aspectRatio: "1:1" },
    ]);
  });

  it("lists durations from an enum or a minimum and maximum", () => {
    expect(durationOptions({ enum: [4, 6, 8] })).toEqual([4, 6, 8]);
    expect(durationOptions({ minimum: 4, maximum: 7 })).toEqual([4, 5, 6, 7]);
    expect(durationOptions(undefined)).toEqual([]);
  });

  it("maps input names to input kinds", () => {
    expect(inputKinds(["frameImages", "referenceAudios"])).toEqual(["image", "audio"]);
    expect(inputKinds(["video"])).toEqual(["video"]);
  });

  it("builds catalog capabilities from a model schema", () => {
    expect(toCapabilities(seedance)).toEqual({
      modes: ["video"],
      inputs: ["image", "video", "audio"],
      resolutions: ["480p", "720p"],
      durationsSeconds: [4, 5, 6, 7],
      aspectRatios: ["16:9", "9:16", "1:1"],
      audio: true,
    });
  });

  it("falls back to preset resolutions when the schema has no resolution enum", () => {
    const seedream = schema(
      { "x-capabilities": ["text-to-image"] },
      { allOf: [{ oneOf: [preset("1K (1:1)"), preset("2K (16:9)")] }] },
    );

    expect(toCapabilities(seedream)).toMatchObject({ modes: ["image"], resolutions: ["1K", "2K"], audio: false });
  });

  it("takes the highest rate as the upstream cost", () => {
    expect(toCost(seedance)).toEqual({ micros: 158_990, unit: "per_second" });
    expect(toCost(schema({ "x-pricing": { currency: "USD", rates: [{ amount: 0.03, unit: "output" }] } }))).toEqual({
      micros: 30_000,
      unit: "per_image",
    });
  });

  it("leaves input surcharges out of the cost", () => {
    const nanoBanana = schema({
      "x-pricing": {
        currency: "USD",
        rates: [
          { amount: 0.04657, unit: "output", label: "0.5K" },
          { amount: 0.15295, unit: "output", label: "4K" },
          { amount: 0.00028, unit: "inputImage" },
        ],
      },
    });

    expect(toCost(nanoBanana)).toEqual({ micros: 152_950, unit: "per_image" });
  });

  it("reads the vendor from the model's creator", () => {
    const withCreator = schema({ "x-creator": { id: "google", name: "Google", logo: "https://assets/google.png" } });

    expect(toVendor(withCreator)).toEqual({ id: "google", name: "Google", logoUrl: "https://assets/google.png" });
    expect(toVendor(schema({}))).toBeNull();
  });

  it("reports no cost when units are mixed or unknown", () => {
    const flux = schema({
      "x-pricing": {
        currency: "USD",
        rates: [
          { amount: 0.03, unit: "outputMegapixel" },
          { amount: 0.015, unit: "inputMegapixel" },
        ],
      },
    });

    expect(toCost(flux)).toBeNull();
    expect(toCost(schema({}))).toBeNull();
  });

  it("marks a missing or retired model inactive", () => {
    expect(toSyncUpdate("vendor:gone@1", null)).toEqual({
      providerModelKey: "vendor:gone@1",
      active: false,
      capabilities: null,
      cost: null,
      vendor: null,
    });
    expect(toSyncUpdate("vendor:model@1", schema({ "x-status": "deprecated" })).active).toBe(false);
    expect(toSyncUpdate("vendor:model@1", seedance).active).toBe(true);
  });
});
