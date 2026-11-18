import type { ReactNode } from "react";
import type { MediaKind } from "@/components/media-card/types";
import type { FieldProps } from "@/components/settings/types";
import type { useStudio } from "./hooks";

/** The two studio surfaces the UI exposes. */
export type GenerationMode = MediaKind;

export type ModelInputKind = "image" | "video" | "audio";

/** Model capability row used by the mock catalog until /api/v1/models exists. */
export type GenerationModelCapabilities = {
  modes: GenerationMode[];
  inputs: ModelInputKind[];
  resolutions: string[];
  durations: string[];
  aspectRatios: string[];
  audio: boolean;
};

export type GenerationModel = {
  id: string;
  slug: string;
  displayName: string;
  provider: string;
  providerModelId: string;
  capabilities: GenerationModelCapabilities;
  isEnabled: boolean;
};

/** 02 Core entities — `templates`. */
export type Template = {
  id: string;
  sourceAssetId: string;
  name: string;
  customizationOptions: Record<string, unknown>;
  createdAt: string;
};

/**
 * A model row plus the price the UI quotes. `cost` is not a column in the
 * `generation_models` table; it comes from the pricing source, and the whole
 * option list is supplied by `src/mocks` until `GET /api/v1/models` is wired.
 */
export type ModelOption = GenerationModel & { cost: number };

export type StudioHeaderProps = {
  mode: GenerationMode;
  credits: number;
};

export type StudioProps = {
  initialMode: GenerationMode;
};

export type StudioState = ReturnType<typeof useStudio>;

export type StudioScopedProps = {
  studio: StudioState;
};

export type StudioPreviewProps = StudioScopedProps & {
  children?: ReactNode;
};

export type StudioFieldProps = Pick<FieldProps, "label" | "children">;

export type StudioSelectOption = {
  value: string;
  label: string;
  hint?: ReactNode;
};

export type StudioSelectFieldProps = {
  label: string;
  value: string;
  options: StudioSelectOption[];
  onChange: (value: string) => void;
};
