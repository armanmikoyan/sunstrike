import { describe, expect, it } from "vitest";
import { CODE_BOX_STAGGER_MS } from "./constants";
import { cooldownSeconds, entranceTransition, flareTransition } from "./utils";

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

describe("entranceTransition", () => {
  it("staggers each box by the shared step", () => {
    expect(entranceTransition(2, true, false)).toMatchObject({ delay: (2 * CODE_BOX_STAGGER_MS) / 1000 });
  });

  it("lands instantly under reduced motion or off screen", () => {
    expect(entranceTransition(3, true, true)).toEqual({ duration: 0 });
    expect(entranceTransition(3, false, false)).toEqual({ duration: 0 });
  });
});

describe("flareTransition", () => {
  it("trails its box by a frame", () => {
    expect(flareTransition(1)).toEqual({
      duration: 0.6,
      ease: "easeOut",
      delay: CODE_BOX_STAGGER_MS / 1000 + 0.08,
    });
  });
});
