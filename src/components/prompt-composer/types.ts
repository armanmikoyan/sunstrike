import type { GenerationMode } from "@/lib/generation";
import type { PromptComposerState } from "./hooks";

export type ComposerAspectMenuProps = {
  composer: PromptComposerState;
};

export type ComposerDurationMenuProps = {
  composer: PromptComposerState;
};

export type ComposerModelMenuProps = {
  composer: PromptComposerState;
};

export type ComposerModeSwitchProps = {
  mode: GenerationMode;
  cost: PromptComposerState["cost"];
  onSwitch: (mode: GenerationMode) => void;
};

export type ComposerAttachmentChipProps = {
  composer: PromptComposerState;
};

export type ComposerAttachMenuProps = {
  composer: PromptComposerState;
};

export type TypingOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
};
