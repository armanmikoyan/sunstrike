"use client";

import { cn } from "cn";
import { LEGAL_COPY } from "./constants";
import type { LegalContentsNavProps } from "./types";

export function LegalContentsNav({ sections, activeId, onSelect }: LegalContentsNavProps) {
  return (
    <nav aria-label={LEGAL_COPY.contentsLabel} className="mt-3 flex flex-col gap-2">
      {sections.map((section) => {
        const active = section.id === activeId;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active ? "location" : undefined}
            onClick={() => onSelect(section.id)}
            className={cn(
              "-ml-2 border-l-2 py-0.5 pl-2 text-xs leading-snug transition-colors lg:text-[0.6875rem]",
              active
                ? "border-white/30 font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {section.title}
          </a>
        );
      })}
    </nav>
  );
}
