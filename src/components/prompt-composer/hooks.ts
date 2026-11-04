"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { getGenerationCost, modelOptions } from "@/lib/generation";
import {
  aspectRatioAtom,
  attachmentAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
  type GenerationMode,
} from "@/lib/store";
import { defaultModel, promptIdeas } from "./constants";

type TypingOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
};

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
  const cost = getGenerationCost(mode, model, duration);
  const typedPlaceholder = useTypingCycle(promptIdeas[mode]);

  const switchMode = (next: GenerationMode) => {
    setMode(next);
    setModel(defaultModel[next]);
    if (next === "image" && aspect === "16:9") setAspect("4:3");
    if (next === "video" && aspect === "4:3") setAspect("16:9");
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
    cost,
    typedPlaceholder,
    fileInputRef,
    switchMode,
    submit,
  };
}

export type PromptComposerState = ReturnType<typeof usePromptComposer>;
