import Link from "next/link";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { Button } from "@/ui/button";
import { HELP_COPY, SUPPORT_EMAIL } from "./constants";
import { HelpGuides } from "./help-guides";
import { HelpQuestions } from "./help-questions";
import { HelpSupportCard } from "./help-support-card";

export function Help() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={HELP_COPY.eyebrow}
        title={HELP_COPY.title}
        description={HELP_COPY.description}
        action={
          <Button asChild variant="subtle" size="cta-sm">
            <Link href={`mailto:${SUPPORT_EMAIL}`}>
              <Mail className="size-3.5" />
              {HELP_COPY.contactSupport}
            </Link>
          </Button>
        }
      />

      <HelpGuides />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18.75rem]">
        <div>
          <h2 className="text-base font-medium tracking-[-0.035em]">{HELP_COPY.commonQuestions}</h2>
          <div className="mt-3">
            <HelpQuestions />
          </div>
        </div>

        <HelpSupportCard />
      </div>
    </PageShell>
  );
}
