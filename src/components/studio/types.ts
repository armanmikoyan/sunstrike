import type { GenerationMode } from "@/lib/store";

export type StudioProps = {
  initialMode: GenerationMode;
};

export type StudioHeaderProps = {
  mode: GenerationMode;
  credits: number;
};
