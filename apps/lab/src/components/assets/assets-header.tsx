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
          <Button variant="subtle" size="cta-sm" onClick={() => fileInputRef.current?.click()}>
            <UploadCloud className="size-3.5" />
            {ASSETS_COPY.upload}
          </Button>
        }
      />
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" className="hidden" />
    </>
  );
}
