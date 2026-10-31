import { atom } from "jotai";

export type GenerationMode = "video" | "image";

export const modeAtom = atom<GenerationMode>("video");
export const promptAtom = atom("");
export const selectedModelAtom = atom("Sunstrike Motion 2");
export const aspectRatioAtom = atom("16:9");
export const durationAtom = atom("5s");
export const balanceAtom = atom(10.54);
export const attachmentAtom = atom<string | null>(null);
export const qualityAtom = atom("Balanced");
