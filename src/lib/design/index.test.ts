import { describe, expect, it } from "vitest";
import {
  API_PATHS,
  modelSupportsSettings,
  type GenerationModel,
  type GenerationSettings,
} from ".";

const settings: GenerationSettings = {
  resolution: "1080p",
  duration: "5s",
  aspectRatio: "16:9",
  audio: true,
};

const model: GenerationModel = {
  id: "mdl_test",
  slug: "chronolab-test",
  displayName: "Chronolab Test",
  provider: "Chronolab",
  providerModelId: "test",
  capabilities: {
    modes: ["video"],
    inputs: ["image"],
    resolutions: ["720p", "1080p"],
    durations: ["4s", "5s", "6s"],
    aspectRatios: ["16:9", "9:16"],
    audio: false,
  },
  isEnabled: true,
};

describe("API_PATHS", () => {
  it("matches the /api/v1 surface from the design", () => {
    expect(API_PATHS.me).toBe("/api/v1/me");
    expect(API_PATHS.generations).toBe("/api/v1/generations");
    expect(API_PATHS.generation("gen_1")).toBe("/api/v1/generations/gen_1");
    expect(API_PATHS.assetUploads).toBe("/api/v1/assets/uploads");
    expect(API_PATHS.assetComplete("ast_1")).toBe(
      "/api/v1/assets/ast_1/complete",
    );
    expect(API_PATHS.asset("ast_1")).toBe("/api/v1/assets/ast_1");
    expect(API_PATHS.templates).toBe("/api/v1/templates");
    expect(API_PATHS.template("tpl_1")).toBe("/api/v1/templates/tpl_1");
    expect(API_PATHS.balance).toBe("/api/v1/balance");
    expect(API_PATHS.topUps).toBe("/api/v1/balance/top-ups");
    expect(API_PATHS.generationQuotes).toBe("/api/v1/generation-quotes");
    expect(API_PATHS.notifications).toBe("/api/v1/notifications");
    expect(API_PATHS.notification("ntf_1")).toBe(
      "/api/v1/notifications/ntf_1",
    );
    expect(API_PATHS.models).toBe("/api/v1/models");
  });
});

describe("modelSupportsSettings", () => {
  it("accepts settings the model advertises", () => {
    expect(
      modelSupportsSettings(model, { ...settings, audio: false }),
    ).toBe(true);
    expect(modelSupportsSettings(model, { ...settings, duration: null, audio: false })).toBe(
      true,
    );
  });

  it("rejects an aspect ratio the model does not advertise", () => {
    expect(modelSupportsSettings(model, { ...settings, aspectRatio: "4:3", audio: false })).toBe(
      false,
    );
  });

  it("rejects an unsupported resolution", () => {
    expect(modelSupportsSettings(model, { ...settings, resolution: "4K", audio: false })).toBe(
      false,
    );
  });

  it("rejects an unsupported duration", () => {
    expect(modelSupportsSettings(model, { ...settings, duration: "12s", audio: false })).toBe(
      false,
    );
  });

  it("rejects audio when the model is silent", () => {
    expect(modelSupportsSettings(model, { ...settings, audio: true })).toBe(
      false,
    );
  });
});
