"use client";

import { UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { ASSETS_COPY } from "./constants";
import type { AssetsHeaderProps } from "./types";

export function AssetsHeader({ fileInputRef }: AssetsHeaderProps) {
  return (
    <>
      <PageHeader
        eyebrow={ASSETS_COPY.eyebrow}
        title={ASSETS_COPY.title}
        description={ASSETS_COPY.description}
        action={
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 rounded-lg border-white/9 bg-white/1.5 px-3 text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/4.5 hover:text-foreground"
          >
            <UploadCloud className="size-3.5" />
            {ASSETS_COPY.upload}
          </Button>
        }
      />
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" className="hidden" />
    </>
  );
}
