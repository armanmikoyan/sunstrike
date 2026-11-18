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
  cost: PromptComposerState["cost"];
  onSwitch: (mode: GenerationMode) => void;
};

export type TypingOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
};
