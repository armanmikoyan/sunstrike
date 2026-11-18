"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useStore, type WritableAtom } from "jotai";
import type { GenerationMode } from "./types";
import { ASPECT_RATIOS, IMAGE_TAKES, STUDIO_MODELS, VIDEO_TAKES } from "./constants";
import { aspectRatiosFor, durationsFor, getGenerationCost, resolutionsFor } from "./utils";
import { modelOptions } from "@/mocks/generation";
import { templateById } from "@/mocks/templates";
import {
  aspectRatioAtom,
  attachmentAtom,
  audioAtom,
  balanceAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  resolutionAtom,
  selectedModelAtom,
  templateIdAtom,
} from "./state";

/**
 * `useAtom` for the generation state that more than one route shares.
 *
 * Next keeps the previous route's tree mounted while another route is on
 * screen, and jotai holds on to the value it read for the last update it saw.
 * A write made from the other route — the studio resets the mode when it
 * opens — never reaches that cached value, so the home prompt bar keeps
 * rendering its old mode. Every tab click then writes the value it already
 * has, nothing changes, and the switch looks dead.
 *
 * Reading the store during render and reading it once more when the
 * subscription is (re)attached keeps the composer in step with the store.
 */
export function useSharedState<Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>) {
  const store = useStore();
  const [, resync] = useReducer((version: number) => version + 1, 0);

  useEffect(() => {
    resync();
    return store.sub(atom, resync);
  }, [store, atom]);

  const setValue = useCallback((...args: Args) => store.set(atom, ...args), [store, atom]);

  return [store.get(atom), setValue] as const;
}

/** All generative state for one studio page, kept out of the view tree. */
export function useStudio(initialMode: GenerationMode) {
  const [, setMode] = useSharedState(modeAtom);
  const [prompt, setPrompt] = useSharedState(promptAtom);
  const [model, setModel] = useSharedState(selectedModelAtom);
  const [aspect, setAspect] = useSharedState(aspectRatioAtom);
  const [duration, setDuration] = useSharedState(durationAtom);
  const [resolution, setResolution] = useSharedState(resolutionAtom);
  const [audio, setAudio] = useSharedState(audioAtom);
  const [templateId, setTemplateId] = useSharedState(templateIdAtom);
  const [attachment, setAttachment] = useSharedState(attachmentAtom);
  const [credits] = useSharedState(balanceAtom);
  const [queued, setQueued] = useState(false);
  const [activeId, setActiveId] = useState(initialMode === "video" ? VIDEO_TAKES[0].id : IMAGE_TAKES[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMode(initialMode);
    setModel(STUDIO_MODELS[initialMode].create);
  }, [initialMode, setMode, setModel]);

  const activeModels = modelOptions[initialMode];
  const selectedModel = activeModels.find((item) => item.displayName === model) ?? activeModels[0];

  // Keep every control inside the capabilities the selected model advertises.
  useEffect(() => {
    const caps = selectedModel.capabilities;
    if (!caps.aspectRatios.includes(aspect)) {
      setAspect(caps.aspectRatios[0]);
    }
    if (caps.durations.length > 0 && !caps.durations.includes(duration)) {
      setDuration(caps.durations[0]);
    }
    if (!caps.resolutions.includes(resolution)) {
      setResolution(caps.resolutions[0]);
    }
    if (!caps.audio && audio) {
      setAudio(false);
    }
  }, [selectedModel, aspect, duration, resolution, audio, setAspect, setDuration, setResolution, setAudio]);

  const cost = getGenerationCost(initialMode, selectedModel, duration);
  const takes = initialMode === "video" ? VIDEO_TAKES : IMAGE_TAKES;
  const active = takes.find((item) => item.id === activeId) ?? takes[0];
  const isVideo = initialMode === "video";
  const vertical = aspect === "9:16" || aspect === "3:4";
  const cinema = aspect === "21:9";
  const cssAspect = aspect.replace(":", " / ");

  return {
    prompt,
    setPrompt,
    model,
    setModel,
    aspect,
    setAspect,
    duration,
    setDuration,
    resolution,
    setResolution,
    audio,
    setAudio,
    templateId,
    setTemplateId,
    template: templateId ? templateById(templateId) : undefined,
    attachment,
    setAttachment,
    credits,
    queued,
    setQueued,
    activeId,
    setActiveId,
    fileInputRef,
    activeModels,
    selectedModel,
    aspectOptions: aspectRatiosFor(selectedModel),
    durationOptions: durationsFor(selectedModel),
    resolutionOptions: resolutionsFor(selectedModel),
    cost,
    takes,
    active,
    isVideo,
    vertical,
    cinema,
    cssAspect,
    aspectLabel: ASPECT_RATIOS.find((ratio) => ratio.value === aspect)?.label,
  };
}
