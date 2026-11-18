"use client";

import { Clapperboard, Layers3, LayoutTemplate } from "lucide-react";
import { STARTER_PROMPTS, STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioSummary({
  studio: { selectedModel, template, aspect, resolution, duration, audio, prompt, isVideo },
}: StudioScopedProps) {
  const shownPrompt = prompt || STARTER_PROMPTS[isVideo ? "video" : "image"];
  const output = [aspect, resolution, isVideo && duration ? duration : null, audio ? "Audio" : null]
    .filter(Boolean)
    .join(" · ");

  const facts = [
    { icon: Layers3, label: STUDIO_COPY.summary.model, value: selectedModel.displayName },
    {
      icon: LayoutTemplate,
      label: STUDIO_COPY.summary.template,
      value: template?.name ?? STUDIO_COPY.summary.noTemplate,
    },
    { icon: Clapperboard, label: STUDIO_COPY.summary.output, value: output },
  ];

  return (
    <>
      <div className="mx-auto mt-7 grid max-w-245 gap-2 sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-center gap-2.5 rounded-lg border border-white/7 bg-white/1.5 px-3 py-2.5"
          >
            <fact.icon className="size-3 text-muted-foreground" strokeWidth={1.8} />
            <div className="min-w-0">
              <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{fact.label}</p>
              <p className="mt-0.5 truncate text-xs lg:text-[0.6875rem]">{fact.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-2.5 max-w-245 rounded-lg border border-white/7 bg-white/1.5 p-3">
        <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{STUDIO_COPY.summary.currentPrompt}</p>
        <p className="mt-1.5 line-clamp-2 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
          {shownPrompt}
        </p>
      </div>
    </>
  );
}
