"use client";

import Link from "next/link";
import { Layers3, Paperclip, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PromptComposerState } from "./hooks";

export function ComposerAttachmentChip({
  composer,
}: {
  composer: PromptComposerState;
}) {
  const { attachment, setAttachment } = composer;
  if (!attachment) return null;

  return (
    <div className="mx-2 mb-1.5 flex w-fit max-w-[calc(100%-1rem)] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5">
      <Paperclip className="size-3 shrink-0 text-muted-foreground" />
      <span className="truncate text-[0.6875rem] text-foreground">
        {attachment}
      </span>
      <button
        type="button"
        onClick={() => setAttachment(null)}
        className="text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Remove attachment"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export function ComposerAttachMenu({
  composer,
}: {
  composer: PromptComposerState;
}) {
  const { fileInputRef, setAttachment } = composer;

  return (
    <>
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
                <Paperclip className="size-[0.9375rem]" />
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
    </>
  );
}
