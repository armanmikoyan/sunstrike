import { atom } from "jotai";
import type { GenerationMode } from "@/lib/generation";

/**
 * Generation state owned by the studio. The home prompt composer is a compact
 * front door to the same settings, so it reads these atoms directly.
 *
 * The atoms map to `POST /api/v1/generations`:
 * prompt, model, settings (aspectRatio, duration, resolution, audio),
 * optional templateId and the reference input.
 */
export const modeAtom = atom<GenerationMode>("video");
export const promptAtom = atom("");
export const selectedModelAtom = atom("Chronolab Motion 2");
export const aspectRatioAtom = atom("16:9");
export const durationAtom = atom("5s");
export const resolutionAtom = atom("1080p");
export const audioAtom = atom(true);
export const templateIdAtom = atom<string | null>(null);
export const balanceAtom = atom(10.54);
export const attachmentAtom = atom<string | null>(null);
