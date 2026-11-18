import { LEGAL_COPY } from "./constants";
import type { LegalContentsContactProps } from "./types";

export function LegalContentsContact({ contactEmail }: LegalContentsContactProps) {
  return (
    <div className="mt-4 border-t border-white/6 pt-3 text-xs leading-relaxed text-muted-foreground lg:text-[0.6875rem]">
      <p>{LEGAL_COPY.contactNote}</p>
      <a
        href={`mailto:${contactEmail}`}
        className="mt-1 block text-foreground/70 transition-colors hover:text-foreground"
      >
        {contactEmail}
      </a>
    </div>
  );
}
