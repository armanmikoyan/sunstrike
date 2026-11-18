import { ArrowUp } from "lucide-react";
import { Button } from "@/ui/button";
import { COMPOSER_COPY } from "./constants";

export function ComposerSubmit() {
  return (
    <div className="ml-auto flex items-center gap-1.5">
      <span className="hidden rounded border border-white/7 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground sm:inline">
        {COMPOSER_COPY.shortcut}
      </span>
      <Button type="submit" size="icon-lg" className="rounded-lg transition-colors" aria-label={COMPOSER_COPY.submit}>
        <ArrowUp className="size-4" strokeWidth={2.4} />
      </Button>
    </div>
  );
}
