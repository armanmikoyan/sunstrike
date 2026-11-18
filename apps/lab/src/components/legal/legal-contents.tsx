"use client";

import { LEGAL_COPY } from "./constants";
import { useActiveSection } from "./hooks";
import { LegalContentsContact } from "./legal-contents-contact";
import { LegalContentsNav } from "./legal-contents-nav";
import type { LegalContentsProps } from "./types";

export function LegalContents({ sections, contactEmail }: LegalContentsProps) {
  const { activeId, select } = useActiveSection(sections);

  return (
    <aside className="hidden h-fit rounded-xl border border-white/8 glass-card p-4 lg:sticky lg:top-16 lg:block">
      <p className="text-xs font-medium lg:text-[0.6875rem]">{LEGAL_COPY.contentsLabel}</p>
      <LegalContentsNav sections={sections} activeId={activeId} onSelect={select} />
      <LegalContentsContact contactEmail={contactEmail} />
    </aside>
  );
}
