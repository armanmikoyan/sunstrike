"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Film,
  Image as ImageIcon,
  ImagePlus,
  Layers3,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { AspectShape } from "@/components/aspect-shape";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { aspectRatios, durations } from "@/lib/generation";
import { mediaById } from "@/lib/media";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { cameraMoves, starterPrompts } from "./constants";
import type { StudioState } from "./hooks";

export function StudioControls({ studio }: { studio: StudioState }) {
  const {
    prompt,
    setPrompt,
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
    setQueued,
    fileInputRef,
    activeModels,
    selectedModel,
    cost,
    isVideo,
    aspectLabel,
  } = studio;

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-[#0f1113] lg:w-[24.25rem] lg:border-b-0 lg:border-r">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="studio-prompt"
            className="text-[0.6875rem] font-medium text-muted-foreground"
          >
            Prompt
          </label>
          <button
            type="button"
            onClick={() => setPrompt(starterPrompts[isVideo ? "video" : "image"])}
            className="flex items-center gap-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <WandSparkles className="size-2.5" />
            Enhance
          </button>
        </div>
        <div className="relative mt-2">
          <Textarea
            id="studio-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              isVideo
                ? "Describe the shot, subject and movement..."
                : "Describe the frame, light and lens..."
            }
            className="min-h-[7rem] resize-none rounded-xl border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-[0.75rem] leading-relaxed placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
          />
          <span className="absolute bottom-2 right-3 font-mono text-[0.6875rem] text-muted-foreground/70">
            {prompt.length}/1200
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-[0.6875rem] font-medium text-muted-foreground">
              References
            </p>
            <Link
              href="/library"
              className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Layers3 className="size-2.5" />
              Library
            </Link>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setAttachment(file.name);
            }}
          />
          <div className="mt-2 grid grid-cols-[1fr_3.625rem] gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[4.375rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.11] bg-white/[0.015] text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/[0.03] hover:text-foreground"
            >
              <Upload className="size-3.5" />
              <span className="text-[0.6875rem]">Drop a frame or reference</span>
            </button>
            {attachment ? (
              <div className="group relative flex h-[4.375rem] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.03]">
                <Image
                  src={mediaById("02")?.poster ?? ""}
                  alt="Reference"
                  fill
                  sizes="58px"
                  className="object-cover opacity-80"
                />
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-black/65 text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove reference"
                >
                  <X className="size-2.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/library"
                className="flex h-[4.375rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <ImagePlus className="size-3.5" />
                <span className="text-[0.6875rem]">Library</span>
              </Link>
            )}
          </div>
          {attachment ? (
            <div className="mt-1.5 flex items-center justify-between text-[0.6875rem]">
              <span className="max-w-[13.75rem] truncate text-muted-foreground">
                {attachment}
              </span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-foreground"
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] font-medium text-muted-foreground">
            Model
          </p>
          <Select value={selectedModel.name} onValueChange={setModel}>
            <SelectTrigger className="mt-2 h-11 w-full rounded-xl border-white/[0.08] bg-white/[0.02] px-3 text-[0.6875rem] hover:bg-white/[0.035] focus-visible:border-white/25 focus-visible:ring-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-[21.25rem] p-1.5">
              {activeModels.map((item) => (
                <SelectItem
                  key={item.name}
                  value={item.name}
                  className="p-2.5 text-[0.6875rem]"
                >
                  <span className="flex w-full items-center justify-between gap-4">
                    <span>{item.name}</span>
                    <span className="font-mono text-[0.6875rem] text-muted-foreground">
                      {formatUSD(item.cost)}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[0.6875rem]">
            <span className="text-muted-foreground">
              {selectedModel.description}
            </span>
            <span className="text-muted-foreground">{selectedModel.tag}</span>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] font-medium text-muted-foreground">
            Aspect ratio
          </p>
          <div className="mt-2 grid grid-cols-6 gap-1 rounded-xl border border-white/[0.07] bg-white/[0.015] p-1">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setAspect(ratio.value)}
                aria-label={`${ratio.label} ${ratio.value}`}
                className={cn(
                  "flex h-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground",
                  aspect === ratio.value &&
                    "bg-white/[0.08] text-foreground shadow-sm",
                )}
              >
                <AspectShape className={ratio.shape} />
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[0.6875rem] text-muted-foreground">
            <span>{aspectLabel}</span>
            <span className="font-mono">{aspect}</span>
          </div>
        </div>

        {isVideo ? (
          <>
            <div className="mt-5">
              <p className="text-[0.6875rem] font-medium text-muted-foreground">
                Duration
              </p>
              <div className="mt-2 flex gap-1">
                {durations.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDuration(value)}
                    className={cn(
                      "h-7 flex-1 rounded-lg border border-white/[0.07] bg-white/[0.015] font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
                      duration === value &&
                        "border-white/20 bg-white/[0.08] text-foreground",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[0.6875rem] font-medium text-muted-foreground">
                Camera
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {cameraMoves.map((move) => (
                  <button
                    key={move}
                    type="button"
                    onClick={() => setCamera(move)}
                    className={cn(
                      "h-7 rounded-lg border border-white/[0.07] bg-white/[0.015] px-2.5 text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
                      camera === move &&
                        "border-white/20 bg-white/[0.08] text-foreground",
                    )}
                  >
                    {move}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <details className="group mt-5 rounded-xl border border-white/[0.07] bg-white/[0.015]">
          <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2.5 text-[0.6875rem] font-medium text-muted-foreground">
            Advanced
            <ChevronDown className="size-3 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-white/[0.06] p-3">
            <label className="text-[0.6875rem] text-muted-foreground">
              Negative prompt
            </label>
            <Input
              placeholder="blur, extra fingers, text..."
              className="mt-1.5 h-8 rounded-lg border-white/[0.08] bg-white/[0.02] text-[0.6875rem]"
            />
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div>
                <label className="text-[0.6875rem] text-muted-foreground">
                  Seed
                </label>
                <Input
                  defaultValue="847291"
                  className="mt-1.5 h-8 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[0.6875rem]"
                />
              </div>
              <div>
                <label className="text-[0.6875rem] text-muted-foreground">
                  Motion strength
                </label>
                <Input
                  defaultValue="62"
                  className="mt-1.5 h-8 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[0.6875rem]"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[0.6875rem] text-foreground/80">
                  Loop take
                </p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  Matches the first and last frame.
                </p>
              </div>
              <Switch checked={loop} onCheckedChange={setLoop} />
            </div>
          </div>
        </details>
      </div>

      <div className="border-t border-border bg-[#0f1113] p-4">
        <div className="mb-2.5 flex items-center justify-between text-[0.6875rem]">
          <span className="text-muted-foreground">Estimated cost</span>
          <span className="font-mono text-foreground/80">{formatUSD(cost)}</span>
        </div>
        <Button
          type="button"
          onClick={() => setQueued(true)}
          className="h-10 w-full rounded-xl bg-brand text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
        >
          {isVideo ? (
            <Film className="size-3.5" />
          ) : (
            <ImageIcon className="size-3.5" />
          )}
          {isVideo ? "Generate video" : "Generate image"}
        </Button>
        <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
          {formatUSD(credits)} available · pay as you go
        </p>
      </div>
    </aside>
  );
}
