"use client";

import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import {
  aspectRatios,
  getGenerationCost,
  modelOptions,
  type GenerationMode,
} from "@/lib/generation";
import {
  aspectRatioAtom,
  attachmentAtom,
  balanceAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
} from "./state";
import { imageTakes, studioModels, videoTakes } from "./constants";

/** All generative state for one studio page, kept out of the view tree. */
export function useStudio(initialMode: GenerationMode) {
  const [, setMode] = useAtom(modeAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [model, setModel] = useAtom(selectedModelAtom);
  const [aspect, setAspect] = useAtom(aspectRatioAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [attachment, setAttachment] = useAtom(attachmentAtom);
  const [credits] = useAtom(balanceAtom);
  const [camera, setCamera] = useState("Dolly in");
  const [loop, setLoop] = useState(false);
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
    activeModels.find((item) => item.name === model) ?? activeModels[0];
  const cost = getGenerationCost(initialMode, selectedModel.name, duration);
  const takes = initialMode === "video" ? videoTakes : imageTakes;
  const active = takes.find((item) => item.id === activeId) ?? takes[0];
  const isVideo = initialMode === "video";
  const vertical = aspect === "9:16" || aspect === "3:4";
  const cinema = aspect === "21:9";
  const cssAspect = aspect.replace(":", " / ");

  return {
    prompt,    setPrompt,
    model,
    setModel,
    aspect,
    setAspect,
    duration,
    setDuration,
    attachment,
    setAttachment,
    credits,
    camera,
    setCamera,
    loop,
    setLoop,
    queued,
    setQueued,
    activeId,
    setActiveId,
    fileInputRef,
    activeModels,
    selectedModel,
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
