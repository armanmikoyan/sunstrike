"use client";

import { useSetAtom } from "jotai";
import { ArrowUpRight, Clapperboard, Mountain, Package, Waves } from "lucide-react";
import { modeAtom, promptAtom, selectedModelAtom } from "@/lib/store";

const suggestions = [
  {
    label: "Cinematic portrait",
    icon: Clapperboard,
    mode: "video" as const,
    prompt:
      "A cinematic portrait in cool blue light, direct gaze, subtle film grain, 85mm lens, slow push in",
  },
  {
    label: "Product film",
    icon: Package,
    mode: "video" as const,
    prompt:
      "A precision product film on a brushed metal plinth, soft studio light, slow orbit, shallow depth of field",
  },
  {
    label: "Worldbuilding",
    icon: Mountain,
    mode: "image" as const,
    prompt:
      "An ancient coastal city built into a cliff, morning fog, cinematic scale, architectural detail",
  },
  {
    label: "Motion loop",
    icon: Waves,
    mode: "video" as const,
    prompt:
      "A seamless loop of liquid chrome folding into itself, high contrast studio light, macro lens",
  },
];

export function PromptSuggestions() {
  const setPrompt = useSetAtom(promptAtom);
  const setMode = useSetAtom(modeAtom);
  const setModel = useSetAtom(selectedModelAtom);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
      <span className="mr-1 hidden text-[12px] text-muted-foreground sm:inline">
        Try
      </span>
      {suggestions.map((suggestion) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => {
              setPrompt(suggestion.prompt);
              setMode(suggestion.mode);
              setModel(
                suggestion.mode === "video"
                  ? "Sunstrike Motion 2"
                  : "Sunstrike Image 2",
              );
            }}
            className="group flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Icon className="size-3.5 opacity-70" />
            {suggestion.label}
            <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-70" />
          </button>
        );
      })}
    </div>
  );
}
