import type { ReactNode } from "react";
import type { MediaKind } from "@/components/media-card/types";
import type { FieldProps } from "@/components/settings/types";
import type { useStudio } from "./hooks";

export type GenerationMode = MediaKind;

export type ModelInputKind = "image" | "video" | "audio";

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

export type Template = {
  id: string;
  sourceAssetId: string;
  name: string;
  customizationOptions: Record<string, unknown>;
  createdAt: string;
};

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
