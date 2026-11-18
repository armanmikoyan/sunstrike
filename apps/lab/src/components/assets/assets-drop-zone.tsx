import { UploadCloud } from "lucide-react";
import { ASSETS_COPY } from "./constants";

export function AssetsDropZone() {
  return (
    <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/11 bg-white/1.5 px-5 py-8 text-center transition-colors hover:border-white/20 hover:bg-white/3">
      <span className="grid size-10 place-items-center rounded-xl border border-white/8 bg-white/3 text-muted-foreground">
        <UploadCloud className="size-4" />
      </span>
      <p className="mt-3 text-xs lg:text-[0.6875rem] font-medium">{ASSETS_COPY.dropTitle}</p>
      <p className="mt-1 text-xs lg:text-[0.6875rem] text-muted-foreground">{ASSETS_COPY.dropHint}</p>
      <input type="file" multiple className="hidden" />
    </label>
  );
}
