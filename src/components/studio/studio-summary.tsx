"use client";

import { Clapperboard, Layers3, LayoutTemplate } from "lucide-react";
import { starterPrompts, studioCopy } from "./constants";
import type { StudioSummaryProps } from "./types";

export function StudioSummary({ studio }: StudioSummaryProps) {
  const copy = studioCopy.summary;
  const {
    selectedModel,
    template,
    aspect,
    resolution,
    duration,
    audio,
    prompt,
    isVideo,
  } = studio;
  const shownPrompt = prompt || starterPrompts[isVideo ? "video" : "image"];
  const output = [
    aspect,
    resolution,
    isVideo && duration ? duration : null,
    audio ? "Audio" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const facts = [
    { icon: Layers3, label: copy.model, value: selectedModel.displayName },
    {
      icon: LayoutTemplate,
      label: copy.template,
      value: template?.name ?? copy.noTemplate,
    },
    { icon: Clapperboard, label: copy.output, value: output },
  ];

  return (
    <>
      <div className="mx-auto mt-7 grid max-w-[61.25rem] gap-2 sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.015] px-3 py-2.5"
          >
            <fact.icon
              className="size-3 text-muted-foreground"
              strokeWidth={1.8}
            />
            <div className="min-w-0">
              <p className="text-[0.6875rem] text-muted-foreground">
                {fact.label}
              </p>
              <p className="mt-0.5 truncate text-[0.6875rem]">{fact.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-2.5 max-w-[61.25rem] rounded-lg border border-white/[0.07] bg-white/[0.015] p-3">
        <p className="text-[0.6875rem] text-muted-foreground">
          {copy.currentPrompt}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-relaxed text-muted-foreground">
          {shownPrompt}
        </p>
      </div>
    </>
  );
}
