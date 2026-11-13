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
  X,
} from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Switch } from "@/ui/switch";
import { Textarea } from "@/ui/textarea";
import { formatUSD } from "@/lib/pricing";
import { mediaById } from "@/mocks/media";
import { templates } from "@/mocks/templates";
import { cn } from "@/lib/utils";
import { studioCopy } from "./constants";
import type { StudioControlsProps } from "./types";

export function StudioControls({ studio }: StudioControlsProps) {
  const copy = studioCopy.controls;
  const {
    prompt,
    setPrompt,
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
    attachment,
    setAttachment,
    credits,
    setQueued,
    fileInputRef,
    activeModels,
    selectedModel,
    aspectOptions,
    durationOptions,
    resolutionOptions,
    cost,
    isVideo,
    aspectLabel,
  } = studio;

  const selectedTemplate =
    templates.find((template) => template.id === templateId) ?? null;

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-[#0f1113] lg:w-[24.25rem] lg:border-b-0 lg:border-r">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <label
          htmlFor="studio-prompt"
          className="text-[0.6875rem] font-medium text-muted-foreground"
        >
          {copy.prompt}
        </label>
        <div className="relative mt-2">
          <Textarea
            id="studio-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={copy.placeholders[isVideo ? "video" : "image"]}
            className="min-h-[7rem] resize-none rounded-xl border-white/[0.08] bg-white/[0.015] px-3 py-2.5 text-[0.75rem] leading-relaxed placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-[0.6875rem] font-medium text-muted-foreground">
              {copy.references}
            </p>
            <Link
              href="/library"
              className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Layers3 className="size-2.5" />
              {copy.library}
            </Link>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
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
              <span className="text-[0.6875rem]">{copy.dropReference}</span>
            </button>
            {attachment ? (
              <div className="group relative flex h-[4.375rem] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.03]">
                <Image
                  src={mediaById("02")?.poster ?? ""}
                  alt={copy.referenceAlt}
                  fill
                  sizes="58px"
                  className="object-cover opacity-80"
                />
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-black/65 text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={copy.removeReference}
                >
                  <X className="size-2.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/library"
                className="flex h-[4.375rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.015] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <ImagePlus className="size-3.5" />
                <span className="text-[0.6875rem]">{copy.library}</span>
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
                {copy.clear}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] font-medium text-muted-foreground">
            {copy.template}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 flex h-11 w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.015] px-3 text-[0.6875rem] font-normal hover:bg-white/[0.035]"
              >
                {selectedTemplate?.name ?? copy.noTemplate}
                <ChevronDown className="size-3.5 text-muted-foreground/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1.5">
              <DropdownMenuRadioGroup
                value={templateId ?? "none"}
                onValueChange={(value) =>
                  setTemplateId(value === "none" ? null : value)
                }
              >
                <DropdownMenuRadioItem
                  value="none"
                  className="p-2.5 text-[0.6875rem]"
                >
                  {copy.noTemplate}
                </DropdownMenuRadioItem>
                {templates.map((template) => (
                  <DropdownMenuRadioItem
                    key={template.id}
                    value={template.id}
                    className="p-2.5 text-[0.6875rem]"
                  >
                    {template.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] font-medium text-muted-foreground">
            {copy.model}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 flex h-11 w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.015] px-3 text-[0.6875rem] font-normal hover:bg-white/[0.035]"
              >
                {selectedModel.displayName}
                <ChevronDown className="size-3.5 text-muted-foreground/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1.5">
              <DropdownMenuRadioGroup
                value={selectedModel.displayName}
                onValueChange={setModel}
              >
                {activeModels.map((item) => (
                  <DropdownMenuRadioItem
                    key={item.id}
                    value={item.displayName}
                    className="p-2.5 text-[0.6875rem]"
                  >
                    <span className="flex w-full items-center justify-between gap-4">
                      <span>{item.displayName}</span>
                      <span className="font-mono text-[0.6875rem] text-muted-foreground">
                        {formatUSD(item.cost)}
                      </span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[0.6875rem]">
            <span className="text-muted-foreground">{selectedModel.provider}</span>
            <span className="text-muted-foreground">
              {selectedModel.capabilities.audio ? copy.audio : copy.silent}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] font-medium text-muted-foreground">
            {copy.aspectRatio}
          </p>
          <div className="mt-2 grid grid-cols-6 gap-1 rounded-xl border border-white/[0.07] bg-white/[0.015] p-1">
            {aspectOptions.map((ratio) => (
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
                <span
                  className={cn(
                    "rounded-[0.125rem] border border-current opacity-80",
                    ratio.shape,
                  )}
                />
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[0.6875rem] text-muted-foreground">
            <span>{aspectLabel}</span>
            <span className="font-mono">{aspect}</span>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] font-medium text-muted-foreground">
            {copy.resolution}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 flex h-9 w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.015] px-3 text-[0.6875rem] font-normal hover:bg-white/[0.035]"
              >
                {resolution}
                <ChevronDown className="size-3.5 text-muted-foreground/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1.5">
              <DropdownMenuRadioGroup
                value={resolution}
                onValueChange={setResolution}
              >
                {resolutionOptions.map((value) => (
                  <DropdownMenuRadioItem
                    key={value}
                    value={value}
                    className="p-2.5 text-[0.6875rem]"
                  >
                    {value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {durationOptions.length > 0 ? (
          <div className="mt-5">
            <p className="text-[0.6875rem] font-medium text-muted-foreground">
              {copy.duration}
            </p>
            <div className="mt-2 flex gap-1">
              {durationOptions.map((value) => (
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
        ) : null}

        {selectedModel.capabilities.audio ? (
          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.6875rem] font-medium text-foreground/80">
                {copy.audio}
              </p>
              <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                {copy.audioHint}
              </p>
            </div>
            <Switch checked={audio} onCheckedChange={setAudio} />
          </div>
        ) : null}
      </div>

      <div className="border-t border-border bg-white/[0.015] p-4">
        <div className="mb-2.5 flex items-center justify-between text-[0.6875rem]">
          <span className="text-muted-foreground">{copy.estimatedCost}</span>
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
          {isVideo ? copy.generate.video : copy.generate.image}
        </Button>
        <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
          {formatUSD(credits)} {copy.available}
        </p>
      </div>
    </aside>
  );
}
