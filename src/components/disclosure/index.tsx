"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { DisclosureProps } from "./types";

export function Disclosure({
  question,
  answer,
  className,
  questionClassName,
  answerClassName,
  iconClassName,
}: DisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={cn("border-b border-white/[0.07] py-4", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full cursor-pointer list-none items-center justify-between gap-4 text-left text-[0.8125rem] font-medium",
          questionClassName,
        )}
      >
        <span>{question}</span>
        <span className={cn("relative size-3 shrink-0", iconClassName)}>
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-muted-foreground" />
          <span
            className={cn(
              "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              open && "rotate-90",
            )}
          />
        </span>
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
              "max-w-[30rem] pt-2 text-[0.8125rem] leading-relaxed text-muted-foreground transition-opacity duration-200 motion-reduce:transition-none",
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
