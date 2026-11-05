import { atom } from "jotai";
import type { GenerationMode } from "@/lib/generation";

/**
 * Generation state owned by the studio. The home prompt composer is a compact
 * front door to the same settings, so it reads these atoms directly.
 */
export const modeAtom = atom<GenerationMode>("video");
export const promptAtom = atom("");
export const selectedModelAtom = atom("Chronolab Motion 2");
export const aspectRatioAtom = atom("16:9");
export const durationAtom = atom("5s");
export const balanceAtom = atom(10.54);
export const attachmentAtom = atom<string | null>(null);
