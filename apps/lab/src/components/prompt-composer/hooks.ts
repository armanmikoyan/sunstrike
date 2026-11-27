"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NAVIGATION_START_EVENT } from "@/components/navigation-progress/constants";
import type { GenerationMode } from "@/components/studio/types";
import { aspectRatiosFor, durationsFor } from "@/components/studio/utils";
import { aspectRatioAtom, attachmentAtom, durationAtom, modeAtom, promptAtom } from "@/components/studio/state";
import { useSelectedModel, useSharedState } from "@/components/studio/hooks";
import { COMPOSER_COPY } from "./constants";
import type { TypingOptions } from "./types";

export function useTypingCycle(
  words: readonly string[],
  { typeSpeed = 24, deleteSpeed = 10, pauseDuration = 1200, enabled = true, paused = false }: TypingOptions = {},
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || paused || words.length === 0) return;

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
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration, enabled, paused]);

  return enabled ? text : (words[0] ?? "");
}

/**
 * True while the element is on screen in a visible tab. The typing hint ticks
 * every 10–24ms, so it must not keep committing renders nobody can see.
 */
export function useOnScreen<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState !== "hidden");

    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return { ref, onScreen: inView && tabVisible };
}

export function usePromptComposer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useSharedState(modeAtom);
  const [prompt, setPrompt] = useSharedState(promptAtom);
  const [aspect, setAspect] = useSharedState(aspectRatioAtom);
  const [duration, setDuration] = useSharedState(durationAtom);
  const [attachment, setAttachment] = useSharedState(attachmentAtom);

  const { status, activeModels, selectedModel, setModel } = useSelectedModel(mode);
  const aspectOptions = selectedModel ? aspectRatiosFor(selectedModel) : [];
  const durationOptions = selectedModel ? durationsFor(selectedModel) : [];
  const modelLabel =
    selectedModel?.displayName ?? (status === "loading" ? COMPOSER_COPY.loadingModels : COMPOSER_COPY.noModels);

  const switchMode = (next: GenerationMode) => {
    setMode(next);
    setModel(null);
  };

  const submit = () => {
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    router.push(`/create/${mode}`);
  };

  return {
    mode,
    prompt,
    setPrompt,
    modelLabel,
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
    fileInputRef,
    switchMode,
    submit,
  };
}
