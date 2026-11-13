import { describe, expect, it } from "vitest";
import {
  IMAGE_VARIANTS,
  mediaById,
  mediaItems,
  VIDEO_VARIANTS,
} from "./media";

describe("media catalogue", () => {
  it("is not empty", () => {
    expect(mediaItems.length).toBeGreaterThan(10);
  });

  it("has unique ids", () => {
    const ids = mediaItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every item the fields the cards render", () => {
    for (const item of mediaItems) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.prompt.length).toBeGreaterThan(10);
      expect(item.model.length).toBeGreaterThan(0);
      expect(["video", "image"]).toContain(item.kind);
      expect(item.cost).toBeGreaterThan(0);
      expect(item.src).toMatch(/^\//);
      expect(item.poster).toMatch(/\.(jpg|png)$/);
      expect(item.fallback).toMatch(/^linear-gradient/);
      expect(item.createdAt.length).toBeGreaterThan(0);
    }
  });

  it("uses an mp4 source for videos and an image for stills", () => {
    for (const item of mediaItems) {
      if (item.kind === "video") {
        const variant = VIDEO_VARIANTS.find(
          (video) => video.preview === item.src,
        );
        expect(variant).toBeDefined();
        expect(variant?.poster).toBe(item.poster);
        expect(item.duration).toBeDefined();
      } else {
        expect(IMAGE_VARIANTS).toContain(item.src);
        expect(item.poster).toBe(item.src);
      }
    }
  });

  it("looks items up by id", () => {
    expect(mediaById("01")?.title).toBe("Extra Time");
    expect(mediaById("does-not-exist")).toBeUndefined();
  });
});

describe("kinds", () => {
  it("only contains the two media kinds the UI exposes", () => {
    const kinds = new Set(mediaItems.map((item) => item.kind));
    expect(kinds).toEqual(new Set(["video", "image"]));
  });
});
