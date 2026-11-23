import { describe, expect, it } from "vitest";
import { cooldownSeconds } from "./utils";

describe("cooldownSeconds", () => {
  it("reads the wait out of Supabase's sentence", () => {
    expect(cooldownSeconds("For security purposes, you can only request this after 24 seconds.")).toBe(24);
  });

  it("falls back when the message has no number", () => {
    expect(cooldownSeconds("Too many attempts.")).toBe(60);
    expect(cooldownSeconds("Too many attempts.", 30)).toBe(30);
  });

  it("handles the singular form", () => {
    expect(cooldownSeconds("You can only request this after 1 second.")).toBe(1);
  });

  it("clamps to a sane window", () => {
    expect(cooldownSeconds("after 0 seconds")).toBe(1);
    expect(cooldownSeconds("after 9000 seconds")).toBe(300);
  });
});
