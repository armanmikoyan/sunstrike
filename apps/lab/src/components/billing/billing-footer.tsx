import { Link } from "@/components/link";
import { ArrowRight } from "lucide-react";
import { BILLING_COPY } from "./constants";

export function BillingFooter() {
  return (
    <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-white/6 bg-white/1.5 px-4 py-3 sm:flex-row sm:items-center">
      <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{BILLING_COPY.footer.note}</p>
      <div className="flex items-center gap-4 text-xs lg:text-[0.6875rem]">
        <Link href="/help" className="text-muted-foreground transition-colors hover:text-foreground">
          {BILLING_COPY.footer.help}
        </Link>
        <Link
          href="/settings/account"
          className="flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground"
        >
          {BILLING_COPY.footer.tax}
          <ArrowRight className="size-2.5" />
        </Link>
      </div>
    </div>
  );
}
