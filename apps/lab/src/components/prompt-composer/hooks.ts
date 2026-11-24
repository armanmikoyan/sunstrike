"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GenerationMode } from "@/components/studio/types";
import { aspectRatiosFor, durationsFor, getGenerationCost } from "@/components/studio/utils";
import {
  aspectRatioAtom,
  attachmentAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
} from "@/components/studio/state";
import { useSelectedModel, useSharedState } from "@/components/studio/hooks";
import { STUDIO_MODELS } from "@/components/studio/constants";
import { PROMPT_IDEAS } from "./constants";
import type { TypingOptions } from "./types";

export function useTypingCycle(
  words: readonly string[],
  { typeSpeed = 24, deleteSpeed = 10, pauseDuration = 1200 }: TypingOptions = {},
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const word = words[wordIndex % words.length];
    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && text === word) {
      delay = pauseDuration;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && text === word) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
        return;
      }

      setText(word.slice(0, text.length + (isDeleting ? -1 : 1)));
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration]);

  return text;
}

export function usePromptComposer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useSharedState(modeAtom);
  const [prompt, setPrompt] = useSharedState(promptAtom);
  const [model, setModel] = useSharedState(selectedModelAtom);
  const [aspect, setAspect] = useSharedState(aspectRatioAtom);
  const [duration, setDuration] = useSharedState(durationAtom);
  const [attachment, setAttachment] = useSharedState(attachmentAtom);

  const { activeModels, selectedModel } = useSelectedModel(mode);
  const cost = getGenerationCost(mode, selectedModel, duration);
  const aspectOptions = aspectRatiosFor(selectedModel);
  const durationOptions = durationsFor(selectedModel);
  const typedPlaceholder = useTypingCycle(PROMPT_IDEAS[mode]);

  const switchMode = (next: GenerationMode) => {
    setMode(next);
    setModel(STUDIO_MODELS[next].create);
  };

  const submit = () => {
    window.dispatchEvent(new Event("chronolab:navigation-start"));
    router.push(`/create/${mode}`);
  };

  return {
    mode,
    prompt,
    setPrompt,
    model,
    setModel,
    aspect,
    setAspect,
    duration,
    setDuration,
    attachment,
    setAttachment,
    activeModels,
    selectedModel,
    aspectOptions,
    durationOptions,
    cost,
    typedPlaceholder,
    fileInputRef,
    switchMode,
    submit,
  };
}
