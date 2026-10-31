import { describe, expect, it } from "vitest";
import {
  generationRates,
  heroMedia,
  mediaById,
  mediaCategories,
  mediaItems,
  topUpPacks,
} from "@/lib/media";

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
      expect(item.author.length).toBeGreaterThan(0);
      expect(item.model.length).toBeGreaterThan(0);
      expect(["video", "image"]).toContain(item.kind);
      expect(item.likes).toBeGreaterThanOrEqual(0);
      expect(item.cost).toBeGreaterThan(0);
      expect(item.src).toMatch(/^\/media\//);
      expect(item.poster).toMatch(/^\/media\/.+\.jpg$/);
      expect(item.fallback).toMatch(/^linear-gradient/);
      expect(item.createdAt.length).toBeGreaterThan(0);
    }
  });

  it("uses an mp4 source for videos and a jpg for stills", () => {
    for (const item of mediaItems) {
      if (item.kind === "video") {
        expect(item.src).toMatch(/\.mp4$/);
        expect(item.duration).toBeDefined();
      } else {
        expect(item.src).toMatch(/\.jpg$/);
      }
    }
  });

  it("looks items up by id", () => {
    expect(mediaById("01")?.title).toBe("Extra Time");
    expect(mediaById("does-not-exist")).toBeUndefined();
  });

  it("builds the hero wall from real items", () => {
    expect(heroMedia.length).toBeGreaterThan(6);
    for (const item of heroMedia) {
      expect(mediaById(item.id)).toBeDefined();
    }
  });
});

describe("filters", () => {
  it("leads the category list with All and keeps the rest unique", () => {
    expect(mediaCategories[0]).toBe("All");
    expect(new Set(mediaCategories).size).toBe(mediaCategories.length);
  });

  it("every item belongs to a listed category", () => {
    const known = new Set(mediaCategories);
    for (const item of mediaItems) {
      expect(known.has(item.category)).toBe(true);
    }
  });
});

describe("pricing data", () => {
  it("offers three top-up packs in dollars", () => {
    expect(topUpPacks.map((pack) => pack.price)).toEqual([10, 25, 50]);
    expect(topUpPacks.filter((pack) => pack.popular)).toHaveLength(1);
  });

  it("publishes per-render rates as dollar strings", () => {
    expect(generationRates.length).toBeGreaterThanOrEqual(4);
    for (const rate of generationRates) {
      expect(rate.price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  it("does not mention credits anywhere in the catalogue", () => {
    const serialised = JSON.stringify({
      mediaItems,
      topUpPacks,
      generationRates,
    });
    expect(serialised).not.toMatch(/credit/i);
  });
});
