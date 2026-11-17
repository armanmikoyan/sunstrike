"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisclosureProps } from "./types";

export function Disclosure({
  question,
  answer,
  className,
  questionClassName,
  answerClassName,
  iconClassName,
  open: controlledOpen,
  onOpenChange,
}: DisclosureProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const panelId = useId();
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("border-b border-white/[0.07]", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm lg:text-[0.75rem] font-medium",
          questionClassName,
        )}
      >
        <span>{question}</span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.8}
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
            open && "rotate-180",
            iconClassName,
          )}
        />
      </button>

      <div
        id={panelId}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "max-w-[30rem] pb-4 pt-2 text-sm lg:text-[0.75rem] leading-relaxed text-muted-foreground transition-opacity duration-200 motion-reduce:transition-none",
              open ? "opacity-100" : "opacity-0",
              answerClassName,
            )}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
