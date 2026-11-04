import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComposerSubmit() {
  return (
    <div className="ml-auto flex items-center gap-1.5">
      <span className="hidden rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground sm:inline">
        ⌘ ↵
      </span>
      <Button
        type="submit"
        size="icon"
        className="size-9 rounded-[0.625rem] bg-brand text-brand-foreground transition-colors hover:bg-brand-hover"
        aria-label="Start generation"
      >
        <ArrowUp className="size-4" strokeWidth={2.4} />
      </Button>
    </div>
  );
}
