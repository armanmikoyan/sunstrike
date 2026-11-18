"use client";

import Link from "next/link";
import { Layers3, Paperclip, Plus, Upload } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerAttachMenu({ composer: { fileInputRef, setAttachment } }: ComposerProps) {
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
                size="icon-lg"
                className="text-muted-foreground hover:bg-white/5.5 hover:text-foreground"
                aria-label={COMPOSER_COPY.attach.ariaLabel}
              >
                <Paperclip className="size-3.75" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{COMPOSER_COPY.attach.addReference}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-56 p-1">
          <DropdownMenuLabel>{COMPOSER_COPY.attach.menuLabel}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
            <Upload className="text-muted-foreground" />
            {COMPOSER_COPY.attach.upload}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAttachment(COMPOSER_COPY.attach.pastedName)}>
            <Plus className="text-muted-foreground" />
            {COMPOSER_COPY.attach.paste}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/library">
              <Layers3 className="text-muted-foreground" />
              {COMPOSER_COPY.attach.fromLibrary}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
