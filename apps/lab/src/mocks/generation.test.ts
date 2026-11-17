import { describe, expect, it } from "vitest";
import { generationModels, modelOptions } from "./generation";

describe("model catalogue", () => {
  it("offers enabled models per mode", () => {
    expect(modelOptions.video).toHaveLength(5);
    expect(modelOptions.image).toHaveLength(4);
  });

  it("matches the generation_models entity", () => {
    for (const model of generationModels) {
      expect(model.id).toMatch(/^mdl_/);
      expect(model.slug).toMatch(/^[a-z0-9-]+$/);
      expect(model.displayName.length).toBeGreaterThan(0);
      expect(model.provider.length).toBeGreaterThan(0);
      expect(model.providerModelId.length).toBeGreaterThan(0);
      expect(model.capabilities.modes.length).toBeGreaterThan(0);
      expect(model.isEnabled).toBe(true);
    }
  });

  it("prices every model in dollars", () => {
    for (const models of Object.values(modelOptions)) {
      for (const model of models) {
        expect(model.cost).toBeGreaterThan(0);
        expect(model.cost).toBeLessThan(1);
      }
    }
  });

  it("video models cost more than image models", () => {
    const cheapestVideo = Math.min(
      ...modelOptions.video.map((model) => model.cost),
    );
    const priciestImage = Math.max(
      ...modelOptions.image.map((model) => model.cost),
    );
    expect(cheapestVideo).toBeGreaterThan(priciestImage);
  });
});
