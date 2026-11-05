import type { ReactNode } from "react";
import type { GenerationMode } from "@/lib/generation";
import type { StudioState } from "./hooks";

export type StudioHeaderProps = {
  mode: GenerationMode;
  credits: number;
};

export type StudioSummaryProps = {
  studio: StudioState;
};

export type StudioPreviewProps = {
  studio: StudioState;
  children?: ReactNode;
};

export type StudioQueueDialogProps = {
  studio: StudioState;
};

export type StudioTakesProps = {
  studio: StudioState;
};

export type StudioControlsProps = {
  studio: StudioState;
};
