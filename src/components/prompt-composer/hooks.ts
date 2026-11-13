"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  aspectRatiosFor,
  durationsFor,
  getGenerationCost,
  type GenerationMode,
} from "@/lib/generation";
import { modelOptions } from "@/mocks/generation";
import {
  aspectRatioAtom,
  attachmentAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
} from "@/components/studio/state";
import { defaultModel, promptIdeas } from "./constants";
import type { TypingOptions } from "./types";

/**
 * Types a word, pauses, deletes it, moves on. Returns the text to render;
 * the caller decides whether it is a placeholder or real content.
 */
export function useTypingCycle(
  words: readonly string[],
  {
    typeSpeed = 55,
    deleteSpeed = 28,
    pauseDuration = 1600,
  }: TypingOptions = {},
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

/** Every atom and derived value the composer needs, plus its two actions. */
export function usePromptComposer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useAtom(modeAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [model, setModel] = useAtom(selectedModelAtom);
  const [aspect, setAspect] = useAtom(aspectRatioAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [attachment, setAttachment] = useAtom(attachmentAtom);

  const activeModels = modelOptions[mode];
  const selectedModel =
    activeModels.find((item) => item.displayName === model) ?? activeModels[0];
  const cost = getGenerationCost(mode, selectedModel, duration);
  const aspectOptions = aspectRatiosFor(selectedModel);
  const durationOptions = durationsFor(selectedModel);
  const typedPlaceholder = useTypingCycle(promptIdeas[mode]);

  // Model capabilities define which settings are legal.
  useEffect(() => {
    const caps = selectedModel.capabilities;
    if (!caps.aspectRatios.includes(aspect)) {
      setAspect(caps.aspectRatios[0]);
    }
    if (caps.durations.length > 0 && !caps.durations.includes(duration)) {
      setDuration(caps.durations[0]);
    }
  }, [
    selectedModel,
    aspect,
    duration,
    setAspect,
    setDuration,
  ]);

  const switchMode = (next: GenerationMode) => {
    setMode(next);
    setModel(defaultModel[next]);
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

export type PromptComposerState = ReturnType<typeof usePromptComposer>;
