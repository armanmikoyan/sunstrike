import { cn } from "@/lib/utils";

/** A tiny outline of an aspect ratio, sized by the ratio's own classes. */
export function AspectShape({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "rounded-[0.125rem] border border-current opacity-80",
        className,
      )}
    />
  );
}
