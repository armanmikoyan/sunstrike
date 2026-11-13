import { describe, expect, it } from "vitest";
import { templateById, templates } from "./templates";
import { mediaById } from "./media";

describe("templates", () => {
  it("points every template at an existing media asset", () => {
    for (const template of templates) {
      expect(mediaById(template.sourceAssetId)).toBeDefined();
    }
  });

  it("names the template and records when it was created", () => {
    for (const template of templates) {
      expect(template.name.length).toBeGreaterThan(0);
      expect(template.customizationOptions).toBeTypeOf("object");
      expect(new Date(template.createdAt).toString()).not.toBe("Invalid Date");
    }
  });

  it("looks a template up by id", () => {
    expect(templateById(templates[0].id)?.name).toBe(templates[0].name);
    expect(templateById("does-not-exist")).toBeUndefined();
  });
});
