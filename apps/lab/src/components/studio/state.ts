import { atom } from "jotai";
import type { GenerationMode, OfferingsState } from "./types";

export const modeAtom = atom<GenerationMode>("video");
export const promptAtom = atom("");
export const offeringsAtom = atom<OfferingsState>({ status: "loading", models: [] });
export const selectedModelAtom = atom<string | null>(null);
export const aspectRatioAtom = atom("16:9");
export const durationAtom = atom(5);
export const resolutionAtom = atom("1080p");
export const audioAtom = atom(true);
export const templateIdAtom = atom<string | null>(null);
export const balanceAtom = atom(10.54);
export const attachmentAtom = atom<string | null>(null);
