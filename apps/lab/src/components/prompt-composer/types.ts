import type { GenerationMode } from "@/components/studio/types";
import type { usePromptComposer } from "./hooks";

export type PromptComposerState = ReturnType<typeof usePromptComposer>;

export type PromptComposerProps = {
  className?: string;
};

export type ComposerProps = {
  composer: PromptComposerState;
};

export type ComposerModeSwitchProps = {
  mode: GenerationMode;
  onSwitch: (mode: GenerationMode) => void;
};

export type TypingOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  enabled?: boolean;
  /** Freeze on the current text, e.g. while the hint is off screen. */
  paused?: boolean;
};
