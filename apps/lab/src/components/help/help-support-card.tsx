import { Link } from "@/components/link";
import { Mail } from "lucide-react";
import { Button } from "@/ui/button";
import { HELP_COPY, SUPPORT_EMAIL } from "./constants";

export function HelpSupportCard() {
  return (
    <div className="h-fit rounded-xl border border-white/8 glass-card p-4">
      <h3 className="text-sm font-medium tracking-[-0.02em]">{HELP_COPY.stuckTitle}</h3>
      <p className="mt-1.5 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
        {HELP_COPY.stuckDescription}
      </p>
      <Button asChild size="cta-sm" className="mt-3.5 w-full">
        <Link href={`mailto:${SUPPORT_EMAIL}`}>
          <Mail className="size-3" />
          {SUPPORT_EMAIL}
        </Link>
      </Button>
      <div className="mt-3.5 flex items-center justify-between border-t border-white/6 pt-3 text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span>{HELP_COPY.hours}</span>
        <span>{HELP_COPY.status}</span>
      </div>
    </div>
  );
}
