"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useStore, type WritableAtom } from "jotai";
import type {
  GenerationMode,
  ModelOption,
  OfferingsResponse,
  OfferingsState,
  Quote,
  QuoteRequest,
  QuoteResponse,
} from "./types";
import { ASPECT_RATIOS, IMAGE_TAKES, OFFERINGS_URL, QUOTE_URL, VIDEO_TAKES } from "./constants";
import {
  aspectRatiosFor,
  durationsFor,
  formatDuration,
  microsToUSD,
  modelsForMode,
  quoteQuery,
  resolutionsFor,
  toModelOption,
} from "./utils";
import { templateById } from "@/mocks/templates";
import {
  aspectRatioAtom,
  attachmentAtom,
  audioAtom,
  balanceAtom,
  durationAtom,
  modeAtom,
  offeringsAtom,
  promptAtom,
  resolutionAtom,
  selectedModelAtom,
  templateIdAtom,
} from "./state";

let offeringsRequest: Promise<OfferingsState> | null = null;

async function fetchOfferings(): Promise<OfferingsState> {
  try {
    const response = await fetch(OFFERINGS_URL, { cache: "no-store" });

    if (!response.ok) return { status: "failed", models: [] };

    const body = (await response.json()) as OfferingsResponse;

    return { status: "ready", models: body.offerings.map(toModelOption) };
  } catch {
    return { status: "failed", models: [] };
  }
}

function loadOfferings(): Promise<OfferingsState> {
  offeringsRequest ??= fetchOfferings().finally(() => {
    offeringsRequest = null;
  });

  return offeringsRequest;
}

async function fetchQuoteTotal(query: string, signal: AbortSignal): Promise<number | null> {
  const response = await fetch(`${QUOTE_URL}?${query}`, { cache: "no-store", signal });

  if (!response.ok) return null;

  const body = (await response.json()) as QuoteResponse;

  return microsToUSD(body.quote.totalMicros);
}

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

export function useOfferings(mode: GenerationMode) {
  const [offerings, setOfferings] = useSharedState(offeringsAtom);

  useEffect(() => {
    if (offerings.status !== "loading") return;

    let active = true;

    async function hydrate() {
      const next = await loadOfferings();

      if (active) setOfferings(next);
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, [offerings.status, setOfferings]);

  const models = useMemo(() => modelsForMode(offerings.models, mode), [offerings.models, mode]);

  return { status: offerings.status, models };
}

export function useQuote(request: QuoteRequest | null): Quote {
  const query = request ? quoteQuery(request) : null;
  const [result, setResult] = useState<{ query: string | null; total: number | null }>({ query: null, total: null });

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    async function requestQuote(search: string) {
      const total = await fetchQuoteTotal(search, controller.signal).catch(() => null);

      if (!controller.signal.aborted) setResult({ query: search, total });
    }

    void requestQuote(query);

    return () => controller.abort();
  }, [query]);

  if (!query) return { total: null, pending: false };

  return { total: result.total, pending: result.query !== query };
}

export function useSelectedModel(mode: GenerationMode) {
  const { status, models } = useOfferings(mode);
  const [modelId, setModelId] = useSharedState(selectedModelAtom);
  const [aspect, setAspect] = useSharedState(aspectRatioAtom);
  const [duration, setDuration] = useSharedState(durationAtom);
  const [resolution, setResolution] = useSharedState(resolutionAtom);
  const [audio, setAudio] = useSharedState(audioAtom);

  const selectedModel = models.find((item) => item.id === modelId) ?? models[0] ?? null;

  useEffect(() => {
    if (!selectedModel) return;

    const caps = selectedModel.capabilities;
    if (!caps.aspectRatios.includes(aspect)) {
      setAspect(caps.aspectRatios[0]);
    }
    if (caps.durationsSeconds.length > 0 && !caps.durationsSeconds.includes(duration)) {
      setDuration(caps.durationsSeconds[0]);
    }
    if (!caps.resolutions.includes(resolution)) {
      setResolution(caps.resolutions[0]);
    }
    if (!caps.audio && audio) {
      setAudio(false);
    }
  }, [selectedModel, aspect, duration, resolution, audio, setAspect, setDuration, setResolution, setAudio]);

  return { status, activeModels: models, selectedModel, setModel: setModelId };
}

export function useGenerationCost(mode: GenerationMode, model: ModelOption | null) {
  const [aspect] = useSharedState(aspectRatioAtom);
  const [duration] = useSharedState(durationAtom);
  const [resolution] = useSharedState(resolutionAtom);
  const [audio] = useSharedState(audioAtom);

  return useQuote(
    model
      ? {
          modelId: model.id,
          mode,
          resolution,
          aspectRatio: aspect,
          durationSeconds: mode === "video" ? duration : null,
          audio,
        }
      : null,
  );
}

export function useStudio(initialMode: GenerationMode, activeModels: ModelOption[], selectedModel: ModelOption) {
  const [, setMode] = useSharedState(modeAtom);
  const [prompt, setPrompt] = useSharedState(promptAtom);
  const [, setModel] = useSharedState(selectedModelAtom);
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
  }, [initialMode, setMode]);

  const cost = useGenerationCost(initialMode, selectedModel);
  const takes = initialMode === "video" ? VIDEO_TAKES : IMAGE_TAKES;
  const active = takes.find((item) => item.id === activeId) ?? takes[0];
  const isVideo = initialMode === "video";
  const vertical = aspect === "9:16" || aspect === "3:4";
  const cinema = aspect === "21:9";
  const cssAspect = aspect.replace(":", " / ");

  return {
    prompt,
    setPrompt,
    setModel,
    aspect,
    setAspect,
    duration,
    durationLabel: formatDuration(duration),
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
