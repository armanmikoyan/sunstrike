import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { LEGAL_COPY } from "./constants";
import { LegalContents } from "./legal-contents";
import type { LegalDocumentViewProps } from "./types";

/**
 * One long-form legal page: a header with the revision date, the sections
 * themselves and a sticky contents rail from `lg` up. The rail is hidden on
 * phones, where the sections already read top to bottom.
 */
export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <PageShell>
      <PageHeader
        eyebrow={document.eyebrow}
        title={document.title}
        description={document.description}
        action={
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">
            {LEGAL_COPY.updatedPrefix} <time dateTime={document.updatedIso}>{document.updated}</time>
          </p>
        }
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <article className="max-w-168">
          {document.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-20 border-b border-white/6 py-6 first:pt-0 last:border-b-0 last:pb-0"
            >
              <h2 className="text-base font-medium tracking-[-0.035em]">{section.title}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground lg:text-xs">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets ? (
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-white/25 lg:text-xs">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <LegalContents sections={document.sections} contactEmail={document.contactEmail} />
      </div>
    </PageShell>
  );
}
