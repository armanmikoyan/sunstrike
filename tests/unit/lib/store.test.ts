import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import {
  aspectRatioAtom,
  attachmentAtom,
  balanceAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
} from "@/lib/store";

describe("generation store defaults", () => {
  it("starts in video mode with the standard model", () => {
    const store = createStore();
    expect(store.get(modeAtom)).toBe("video");
    expect(store.get(selectedModelAtom)).toBe("Chronolab Motion 2");
  });

  it("starts from the landscape, five second preset", () => {
    const store = createStore();
    expect(store.get(aspectRatioAtom)).toBe("16:9");
    expect(store.get(durationAtom)).toBe("5s");
  });

  it("starts with an empty prompt and no attachment", () => {
    const store = createStore();
    expect(store.get(promptAtom)).toBe("");
    expect(store.get(attachmentAtom)).toBeNull();
  });

  it("keeps the balance in dollars", () => {
    const store = createStore();
    expect(store.get(balanceAtom)).toBe(10.54);
  });

  it("stores mode switches and prompts", () => {
    const store = createStore();
    store.set(modeAtom, "image");
    store.set(promptAtom, "a stray cat on a rooftop");
    store.set(attachmentAtom, "frame-01.jpg");

    expect(store.get(modeAtom)).toBe("image");
    expect(store.get(promptAtom)).toBe("a stray cat on a rooftop");
    expect(store.get(attachmentAtom)).toBe("frame-01.jpg");
  });
});
