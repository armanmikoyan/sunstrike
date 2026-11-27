import { UploadCloud } from "lucide-react";
import { ASSETS_COPY } from "./constants";

export function AssetsDropZone() {
  return (
    <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/11 bg-white/1.5 px-4 py-3.5 transition-colors hover:border-white/20 hover:bg-white/3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/8 bg-white/3 text-muted-foreground">
        <UploadCloud className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs lg:text-[0.6875rem] font-medium">{ASSETS_COPY.dropTitle}</span>
        <span className="mt-0.5 block text-xs lg:text-[0.6875rem] text-muted-foreground">{ASSETS_COPY.dropHint}</span>
      </span>
      <input type="file" multiple className="hidden" />
    </label>
  );
}
