"use client";

import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import {
  aspectRatios,
  aspectRatiosFor,
  durationsFor,
  getGenerationCost,
  resolutionsFor,
  type GenerationMode,
} from "@/lib/generation";
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
import { imageTakes, studioModels, videoTakes } from "./constants";

/** All generative state for one studio page, kept out of the view tree. */
export function useStudio(initialMode: GenerationMode) {
  const [, setMode] = useAtom(modeAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [model, setModel] = useAtom(selectedModelAtom);
  const [aspect, setAspect] = useAtom(aspectRatioAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [resolution, setResolution] = useAtom(resolutionAtom);
  const [audio, setAudio] = useAtom(audioAtom);
  const [templateId, setTemplateId] = useAtom(templateIdAtom);
  const [attachment, setAttachment] = useAtom(attachmentAtom);
  const [credits] = useAtom(balanceAtom);
  const [queued, setQueued] = useState(false);
  const [activeId, setActiveId] = useState(
    initialMode === "video" ? videoTakes[0].id : imageTakes[0].id,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMode(initialMode);
    setModel(studioModels[initialMode].create);
  }, [initialMode, setMode, setModel]);

  const activeModels = modelOptions[initialMode];
  const selectedModel =
    activeModels.find((item) => item.displayName === model) ?? activeModels[0];

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
  }, [
    selectedModel,
    aspect,
    duration,
    resolution,
    audio,
    setAspect,
    setDuration,
    setResolution,
    setAudio,
  ]);

  const cost = getGenerationCost(initialMode, selectedModel, duration);
  const takes = initialMode === "video" ? videoTakes : imageTakes;
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
    aspectLabel: aspectRatios.find((ratio) => ratio.value === aspect)?.label,
  };
}

export type StudioState = ReturnType<typeof useStudio>;
