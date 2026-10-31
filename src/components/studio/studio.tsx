"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAtom } from "jotai";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Download,
  Film,
  Heart,
  Image as ImageIcon,
  ImagePlus,
  Layers3,
  Maximize,
  MoreHorizontal,
  Pause,
  Play,
  Scissors,
  Share2,
  Upload,
  Volume2,
  WandSparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/pricing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  aspectRatios,
  durations,
  getGenerationCost,
  modelOptions,
} from "@/lib/generation";
import { mediaById, type MediaItem } from "@/lib/media";
import {
  aspectRatioAtom,
  attachmentAtom,
  balanceAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
  type GenerationMode,
} from "@/lib/store";
import { cn } from "@/lib/utils";

const cameraMoves = ["Static", "Dolly in", "Orbit", "Crane", "Handheld"];

const videoTakes = ["09", "07", "14", "16"]
  .map((id) => mediaById(id))
  .filter((item): item is MediaItem => Boolean(item));
const imageTakes = ["05", "10", "17", "18"]
  .map((id) => mediaById(id))
  .filter((item): item is MediaItem => Boolean(item));

const starterPrompts: Record<GenerationMode, string> = {
  video:
    "A slow dolly through a rain-soaked Tokyo alley at midnight, neon reflections on wet asphalt, shallow depth of field, anamorphic flare, cinematic color grade.",
  image:
    "An editorial portrait in cool blue studio light, direct gaze, subtle film grain, 85mm lens, minimal styling, crisp catchlights.",
};

function AspectShape({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "rounded-[2px] border border-current opacity-80",
        className,
      )}
    />
  );
}

export function Studio({ initialMode }: { initialMode: GenerationMode }) {
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

  useEffect(() => {
    setMode(initialMode);
    setModel(
      initialMode === "video" ? "Sunstrike Motion 2" : "Sunstrike Image 2",
    );
  }, [initialMode, setMode, setModel]);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col lg:h-[calc(100vh-3rem)] lg:min-h-[720px] lg:overflow-hidden">
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            <Link href="/" aria-label="Back home">
              <ArrowLeft className="size-3.5" />
            </Link>
          </Button>
          <span className="h-4 w-px bg-border" />
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[12px] font-medium">
              {isVideo ? "Video Studio" : "Image Studio"}
            </span>
            <span className="hidden rounded border border-white/[0.08] bg-white/[0.025] px-1.5 py-0.5 text-[11px] text-muted-foreground sm:inline">
              Draft
            </span>
          </div>
          <div className="ml-1 hidden items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5 sm:flex">
            <Link
              href="/create/video"
              className={cn(
                "flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-muted-foreground",
                isVideo && "bg-white/[0.08] text-foreground",
              )}
            >
              <Film className="size-2.5" />
              Video
            </Link>
            <Link
              href="/create/image"
              className={cn(
                "flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-muted-foreground",
                !isVideo && "bg-white/[0.08] text-foreground",
              )}
            >
              <ImageIcon className="size-2.5" />
              Image
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden rounded-md border border-white/[0.07] px-2 py-1 text-[11px] text-muted-foreground md:block">
            {formatUSD(credits)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            aria-label="Share project"
          >
            <Share2 className="size-3.5" />
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 rounded-md border-white/[0.09] bg-white/[0.025] px-2.5 text-[11px] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            <Link href="/library">
              Library
              <ArrowUpRight className="size-3" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-border bg-[#0f1113] lg:w-[388px] lg:border-b-0 lg:border-r">
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="studio-prompt"
                className="text-[11px] font-medium text-muted-foreground"
              >
                Prompt
              </label>
              <button
                type="button"
                onClick={() => setPrompt(starterPrompts[initialMode])}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                className="min-h-[112px] resize-none rounded-xl border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-[12px] leading-relaxed placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
              <span className="absolute bottom-2 right-3 font-mono text-[11px] text-muted-foreground/70">
                {prompt.length}/1200
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-muted-foreground">
                  References
                </p>
                <Link
                  href="/library"
                  className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
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
              <div className="mt-2 grid grid-cols-[1fr_58px] gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.11] bg-white/[0.015] text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/[0.03] hover:text-foreground"
                >
                  <Upload className="size-3.5" />
                  <span className="text-[11px]">Drop a frame or reference</span>
                </button>
                {attachment ? (
                  <div className="group relative flex h-[70px] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/[0.03]">
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
                    className="flex h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    <ImagePlus className="size-3.5" />
                    <span className="text-[11px]">Library</span>
                  </Link>
                )}
              </div>
              {attachment ? (
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="max-w-[220px] truncate text-muted-foreground">
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
              <p className="text-[11px] font-medium text-muted-foreground">
                Model
              </p>
              <Select value={selectedModel.name} onValueChange={setModel}>
                <SelectTrigger className="mt-2 h-11 w-full rounded-xl border-white/[0.08] bg-white/[0.02] px-3 text-[11px] hover:bg-white/[0.035] focus-visible:border-white/25 focus-visible:ring-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-[340px] p-1.5">
                  {activeModels.map((item) => (
                    <SelectItem
                      key={item.name}
                      value={item.name}
                      className="p-2.5 text-[11px]"
                    >
                      <span className="flex w-full items-center justify-between gap-4">
                        <span>{item.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {formatUSD(item.cost)}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px]">
                <span className="text-muted-foreground">
                  {selectedModel.description}
                </span>
                <span className="text-muted-foreground">{selectedModel.tag}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-medium text-muted-foreground">
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
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  {aspectRatios.find((ratio) => ratio.value === aspect)?.label}
                </span>
                <span className="font-mono">{aspect}</span>
              </div>
            </div>

            {isVideo ? (
              <>
                <div className="mt-5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Duration
                  </p>
                  <div className="mt-2 flex gap-1">
                    {durations.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDuration(value)}
                        className={cn(
                          "h-7 flex-1 rounded-lg border border-white/[0.07] bg-white/[0.015] font-mono text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
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
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Camera
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {cameraMoves.map((move) => (
                      <button
                        key={move}
                        type="button"
                        onClick={() => setCamera(move)}
                        className={cn(
                          "h-7 rounded-lg border border-white/[0.07] bg-white/[0.015] px-2.5 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
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
              <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2.5 text-[11px] font-medium text-muted-foreground">
                Advanced
                <ChevronDown className="size-3 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-white/[0.06] p-3">
                <label className="text-[11px] text-muted-foreground">
                  Negative prompt
                </label>
                <Input
                  placeholder="blur, extra fingers, text..."
                  className="mt-1.5 h-8 rounded-lg border-white/[0.08] bg-white/[0.02] text-[11px]"
                />
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-muted-foreground">
                      Seed
                    </label>
                    <Input
                      defaultValue="847291"
                      className="mt-1.5 h-8 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">
                      Motion strength
                    </label>
                    <Input
                      defaultValue="62"
                      className="mt-1.5 h-8 rounded-lg border-white/[0.08] bg-white/[0.02] font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-foreground/80">
                      Loop take
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Matches the first and last frame.
                    </p>
                  </div>
                  <Switch checked={loop} onCheckedChange={setLoop} />
                </div>
              </div>
            </details>
          </div>

          <div className="border-t border-border bg-[#0f1113] p-4">
            <div className="mb-2.5 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Estimated cost</span>
              <span className="font-mono text-foreground/80">{formatUSD(cost)}</span>
            </div>
            <Button
              type="button"
              onClick={() => setQueued(true)}
              className="h-10 w-full rounded-xl bg-brand text-[12px] font-medium text-brand-foreground hover:bg-brand-hover"
            >
              {isVideo ? (
                <Film className="size-3.5" />
              ) : (
                <ImageIcon className="size-3.5" />
              )}
              {isVideo ? "Generate video" : "Generate image"}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {formatUSD(credits)} available · pay as you go
            </p>
          </div>
        </aside>

        <section className="flex min-h-0 flex-1 flex-col bg-[#131517]">
          <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium">Preview</span>
              <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                {aspect}
              </span>
              <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
                <Clock3 className="size-2.5" />
                {active.createdAt}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="hidden rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
                1080p
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                aria-label="Download preview"
              >
                <Download className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                aria-label="More options"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-[980px]">
              <div
                className={cn(
                  "relative mx-auto w-full overflow-hidden rounded-xl border border-white/[0.1] bg-secondary shadow-[0_30px_100px_-40px_rgba(0,0,0,0.9)]",
                  vertical && "max-w-[360px]",
                  !vertical && !cinema && "max-w-[760px]",
                )}
                style={{ aspectRatio: cssAspect }}
              >
                {isVideo && active.kind === "video" ? (
                  <video
                    key={active.id}
                    src={active.src}
                    poster={active.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <Image
                    src={active.poster}
                    alt={active.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span className="flex items-center gap-1 rounded-md border border-white/15 bg-black/40 px-1.5 py-1 text-[11px] text-white/80 backdrop-blur-md">
                    {isVideo ? (
                      <Film className="size-2.5" />
                    ) : (
                      <ImageIcon className="size-2.5" />
                    )}
                    Sunstrike {isVideo ? "Motion 2" : "Image 2"}
                  </span>
                  <span className="rounded-md border border-white/15 bg-black/40 px-1.5 py-1 font-mono text-[11px] text-white/65 backdrop-blur-md">
                    Take 03
                  </span>
                </div>

                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  <span className="rounded-md border border-white/15 bg-black/40 px-1.5 py-1 font-mono text-[11px] text-white/65 backdrop-blur-md">
                    {duration} · 24fps
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Play preview"
                  className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-md transition-colors hover:bg-black/55"
                >
                  {isVideo ? (
                    <Play className="ml-0.5 size-4 fill-current" />
                  ) : (
                    <Maximize className="size-4" />
                  )}
                </button>

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <div className="mb-2.5 flex items-center gap-1.5">
                    <span className="rounded border border-white/15 bg-black/30 px-1.5 py-0.5 font-mono text-[11px] text-white/70">
                      00:0{isVideo ? 2 : 0}
                    </span>
                    <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
                      <span className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-foreground/80" />
                      <span className="absolute left-[38%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
                    </div>
                    <span className="font-mono text-[11px] text-white/60">
                      {isVideo ? duration : "still"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {isVideo ? (
                        <button
                          type="button"
                          className="grid size-7 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
                          aria-label="Pause"
                        >
                          <Pause className="size-3 fill-current" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                        aria-label="Volume"
                      >
                        <Volume2 className="size-3" />
                      </button>
                      <button
                        type="button"
                        className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                        aria-label="Trim"
                      >
                        <Scissors className="size-3" />
                      </button>
                      <span className="ml-1 max-w-[220px] truncate text-[11px] text-white/55">
                        {active.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                      aria-label="Fullscreen"
                    >
                      <Maximize className="size-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-3 flex max-w-[980px] items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium">{active.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {selectedModel.name} · {aspect} · {isVideo ? duration : "1 MP"} ·{" "}
                    {formatUSD(cost)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] px-2 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    <Heart className="size-3" />
                    {active.likes.toLocaleString("en-US")}
                  </button>
                  <button
                    type="button"
                    className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] px-2 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    <Download className="size-3" />
                    Download
                  </button>
                </div>
              </div>

              <div className="mx-auto mt-7 max-w-[980px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Recent takes
                    </span>
                    <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {takes.length}
                    </span>
                  </div>
                  <Link
                    href="/library"
                    className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View all
                    <ArrowUpRight className="size-2.5" />
                  </Link>
                </div>
                <div className="mt-2.5 grid grid-cols-4 gap-2">
                  {takes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={cn(
                        "group relative aspect-[3/4] overflow-hidden rounded-lg border bg-secondary text-left transition-colors",
                        active.id === item.id
                          ? "border-white/30 ring-1 ring-white/15"
                          : "border-white/[0.07] hover:border-white/20",
                      )}
                    >
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        sizes="200px"
                        className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <span className="absolute left-1.5 top-1.5 grid size-4 place-items-center rounded bg-black/35 text-white/80 backdrop-blur">
                        {isVideo ? (
                          <Play className="size-2 fill-current" />
                        ) : (
                          <ImageIcon className="size-2" />
                        )}
                      </span>
                      {active.id === item.id ? (
                        <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-foreground text-background">
                          <Check className="size-2.5" />
                        </span>
                      ) : null}
                      <span className="absolute inset-x-1.5 bottom-1.5 truncate text-[11px] text-white/80">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-7 grid max-w-[980px] gap-2 sm:grid-cols-3">
                {[
                  {
                    icon: Layers3,
                    label: "Model",
                    value: selectedModel.name,
                  },
                  {
                    icon: Clapperboard,
                    label: "Direction",
                    value: isVideo ? `${camera} · ${duration}` : "Single frame",
                  },
                  {
                    icon: Layers3,
                    label: "Output",
                    value: `${aspect} · 1080p`,
                  },
                ].map((info) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={info.label}
                      className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
                    >
                      <Icon className="size-3 text-muted-foreground" strokeWidth={1.8} />
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">
                          {info.label}
                        </p>
                        <p className="mt-0.5 truncate text-[11px]">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mx-auto mt-2.5 max-w-[980px] rounded-lg border border-white/[0.07] bg-white/[0.015] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    Current prompt
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Prompt options"
                      >
                        <MoreHorizontal className="size-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 p-1.5">
                      <DropdownMenuLabel>Prompt</DropdownMenuLabel>
                      <DropdownMenuItem className="p-2 text-[11px]">
                        Copy prompt
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-2 text-[11px]">
                        Save to favorites
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="p-2 text-[11px]">
                        Reset to last
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                  {prompt || starterPrompts[initialMode]}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={queued} onOpenChange={setQueued}>
        <DialogContent className="border-white/10 bg-[#1c1e20] sm:max-w-[400px]">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-muted-foreground">
              <Clock3 className="size-4" />
            </div>
            <DialogTitle className="text-[18px] tracking-[-0.03em]">
              Render queued
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-relaxed">
              Your {isVideo ? "video" : "image"} is in the queue. This prototype
              holds the shot in the library while the real renderer is wired up.
              {formatUSD(cost)} reserved.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
            <p className="text-[11px] text-muted-foreground">
              Recipe
            </p>
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-foreground/75">
              {prompt || starterPrompts[initialMode]}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[selectedModel.name, aspect, isVideo ? duration : "1 MP", formatUSD(cost)].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded border border-white/[0.08] bg-black/20 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
          <DialogFooter className="border-white/[0.07] bg-white/[0.015]">
            <Button
              variant="outline"
              className="h-8 rounded-lg border-white/10 bg-transparent text-[11px]"
              onClick={() => setQueued(false)}
            >
              Keep directing
            </Button>
            <Button
              asChild
              className="h-8 rounded-lg bg-brand px-3 text-[11px] text-brand-foreground hover:bg-brand-hover"
            >
              <Link href="/library">Open library</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
