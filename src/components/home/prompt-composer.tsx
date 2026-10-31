"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Film,
  Image as ImageIcon,
  Layers3,
  Paperclip,
  Plus,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { useTypingCycle } from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  aspectRatioAtom,
  attachmentAtom,
  durationAtom,
  modeAtom,
  promptAtom,
  selectedModelAtom,
  type GenerationMode,
} from "@/lib/store";
import {
  aspectRatios,
  durations,
  getGenerationCost,
  modelOptions,
} from "@/lib/generation";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PROMPT_IDEAS = {
  video: [
    "A slow dolly through a rain-soaked Tokyo alley, neon reflections, anamorphic lens, shallow depth of field.",
    "Fashion campaign on a salt flat at golden hour, yellow tailoring, slow camera push, 35mm film grain.",
    "An astronaut drifting through a violet nebula, volumetric light, IMAX cinematography, dust particles.",
    "Liquid chrome folding into a human face, macro lens, high contrast studio light, seamless loop.",
  ],
  image: [
    "An editorial portrait in cool blue light, direct gaze, subtle film grain, 85mm lens, shallow focus.",
    "Iridescent ceramic form floating in pastel haze, softbox lighting, product study, muted backdrop.",
    "A lone cabin beside an alpine lake, low clouds on the ridge, muted film stock, overcast light.",
    "Chrome and magenta liquid metal, high contrast studio light, abstract still life, glossy surface.",
  ],
} as const;

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

export function PromptComposer({ className }: { className?: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useAtom(modeAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [model, setModel] = useAtom(selectedModelAtom);
  const [aspect, setAspect] = useAtom(aspectRatioAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [attachment, setAttachment] = useAtom(attachmentAtom);

  const activeModels = modelOptions[mode];
  const cost = getGenerationCost(mode, model, duration);
  const typedPlaceholder = useTypingCycle(PROMPT_IDEAS[mode]);

  const switchMode = (next: GenerationMode) => {
    setMode(next);
    setModel(next === "video" ? "Sunstrike Motion 2" : "Sunstrike Image 2");
    if (next === "image" && aspect === "16:9") setAspect("4:3");
    if (next === "video" && aspect === "4:3") setAspect("16:9");
  };

  const submit = () => {
    window.dispatchEvent(new Event("sunstrike:navigation-start"));
    router.push(`/create/${mode}`);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "group/composer relative w-full rounded-[18px] bg-[#17191c]/72 p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-brightness-[0.88] backdrop-saturate-[0.75] transition-[box-shadow,background-color] duration-300 focus-within:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_28px_90px_-30px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      {/* Glass sheen: a soft top light over the frosted panel, under the
          content so it never washes out the prompt. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_42%,rgba(255,255,255,0)_72%)]"
      />
      <div className="flex items-center justify-between gap-3 px-1.5 pb-1 pt-1">
        <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.025] p-0.5">
          <button
            type="button"
            onClick={() => switchMode("video")}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
              mode === "video" && "bg-white/[0.085] text-foreground shadow-sm",
            )}
          >
            <Film className="size-3" />
            Video
          </button>
          <button
            type="button"
            onClick={() => switchMode("image")}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
              mode === "image" && "bg-white/[0.085] text-foreground shadow-sm",
            )}
          >
            <ImageIcon className="size-3" />
            Image
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">Estimated</span>
          <span className="font-mono text-[11px] text-foreground/75">{formatUSD(cost)}</span>
        </div>
      </div>

      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          className="min-h-[78px] resize-none border-0 bg-transparent px-3 py-2 text-[14px] leading-relaxed shadow-none placeholder:text-muted-foreground/65 focus-visible:ring-0 dark:bg-transparent"
          aria-label="Describe your generation"
        />
        {prompt.length === 0 ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-3 top-2 text-[14px] leading-relaxed text-muted-foreground/65"
          >
            {typedPlaceholder}
            <span className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.12em] animate-pulse bg-muted-foreground/60 motion-reduce:animate-none" />
          </span>
        ) : null}
      </div>

      {attachment ? (
        <div className="mx-2 mb-1.5 flex w-fit max-w-[calc(100%-1rem)] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5">
          <Paperclip className="size-3 shrink-0 text-muted-foreground" />
          <span className="truncate text-[11px] text-foreground">{attachment}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Remove attachment"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-1 px-0.5 pb-0.5">
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

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-muted-foreground hover:bg-white/[0.055] hover:text-foreground"
                  aria-label="Attach reference"
                >
                  <Paperclip className="size-[15px]" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Add reference</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="w-56 p-1.5">
            <DropdownMenuLabel>Reference</DropdownMenuLabel>
            <DropdownMenuItem
              className="p-2"
              onSelect={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4 text-muted-foreground" />
              Upload from device
            </DropdownMenuItem>
            <DropdownMenuItem
              className="p-2"
              onSelect={() => setAttachment("pasted-reference.png")}
            >
              <Plus className="size-4 text-muted-foreground" />
              Paste from clipboard
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-2">
              <Link href="/library">
                <Layers3 className="size-4 text-muted-foreground" />
                Choose from library
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-lg px-2 text-[11px] font-medium text-foreground/80 hover:bg-white/[0.055] hover:text-foreground"
            >
              <WandSparkles className="size-3 text-muted-foreground" />
              <span className="max-w-[100px] truncate sm:max-w-none">
                {model}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[286px] p-1.5">
            <DropdownMenuLabel className="flex items-center justify-between">
              {mode === "video" ? "Motion model" : "Image model"}
              <span className="text-[11px] font-normal text-muted-foreground">
                {mode === "video" ? "Motion" : "Image"}
              </span>
            </DropdownMenuLabel>
            {activeModels.map((item) => (
              <DropdownMenuItem
                key={item.name}
                onSelect={() => setModel(item.name)}
                className="items-start gap-2 p-2"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-white/[0.07] bg-white/[0.03]",
                    model === item.name && "border-white/20 bg-white/[0.08] text-foreground",
                  )}
                >
                  {model === item.name ? (
                    <Check className="size-3.5" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[12px] font-medium">
                    {item.name}
                    <span className="rounded bg-white/[0.055] px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground">
                      {item.tag}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {item.description} · {formatUSD(item.cost)}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-2 text-[11px] text-muted-foreground">
              <Link href="/pricing">Compare models and rates</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="mx-0.5 h-3.5 w-px bg-white/[0.08]" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-lg px-2 text-[11px] font-medium text-muted-foreground hover:bg-white/[0.055] hover:text-foreground"
            >
              <AspectShape
                className={
                  aspectRatios.find((ratio) => ratio.value === aspect)?.shape ??
                  "h-3 w-4"
                }
              />
              {aspect}
              <ChevronDown className="size-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1.5">
            <DropdownMenuLabel>Aspect ratio</DropdownMenuLabel>
            {aspectRatios.map((ratio) => (
              <DropdownMenuItem
                key={ratio.value}
                onSelect={() => setAspect(ratio.value)}
                className="gap-2 p-2"
              >
                <AspectShape className={ratio.shape} />
                <span className="text-[12px]">{ratio.value}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {ratio.label}
                </span>
                {aspect === ratio.value ? (
                  <Check className="size-3 text-foreground" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {mode === "video" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 rounded-lg px-2 text-[11px] font-medium text-muted-foreground hover:bg-white/[0.055] hover:text-foreground"
              >
                {duration}
                <ChevronDown className="size-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 p-1.5">
              <DropdownMenuLabel>Duration</DropdownMenuLabel>
              {durations.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onSelect={() => setDuration(value)}
                  className="p-2 text-[12px]"
                >
                  {value}
                  {duration === value ? (
                    <Check className="ml-auto size-3 text-foreground" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        <div className="ml-auto flex items-center gap-1.5">
          <span className="hidden rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
            ⌘ ↵
          </span>
          <Button
            type="submit"
            size="icon"
            className="size-9 rounded-[10px] bg-brand text-brand-foreground transition-colors hover:bg-brand-hover"
            aria-label="Start generation"
          >
            <ArrowUp className="size-4" strokeWidth={2.4} />
          </Button>
        </div>
      </div>
    </form>
  );
}
