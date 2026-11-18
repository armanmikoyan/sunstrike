import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { IconBox } from "@/ui/icon-box";
import { Button } from "@/ui/button";
import { HELP_COPY, SUPPORT_EMAIL } from "./constants";

export function HelpSupportCard() {
  return (
    <div className="h-fit rounded-xl border border-white/8 glass-card p-5">
      <IconBox className="size-9 border-white/8 bg-white/3">
        <MessageCircle className="size-4" />
      </IconBox>
      <h3 className="mt-4 text-sm lg:text-xs font-medium">{HELP_COPY.stuckTitle}</h3>
      <p className="mt-1.5 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
        {HELP_COPY.stuckDescription}
      </p>
      <Button asChild size="cta-sm" className="mt-4 w-full">
        <Link href={`mailto:${SUPPORT_EMAIL}`}>
          <Mail className="size-3" />
          {SUPPORT_EMAIL}
        </Link>
      </Button>
      <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3 text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span>{HELP_COPY.hours}</span>
        <span>{HELP_COPY.status}</span>
      </div>
    </div>
  );
}
