import { Link } from "@/components/link";
import { Plus } from "lucide-react";
import { Button } from "@/ui/button";
import { BILLING_COPY } from "./constants";

export function BillingHeader() {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/6 px-5 py-4">
      <div>
        <h2 className="text-sm lg:text-xs font-medium">{BILLING_COPY.title}</h2>
        <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">{BILLING_COPY.description}</p>
      </div>
      <Button asChild size="cta-xs" className="shrink-0">
        <Link href="/pricing">
          <Plus className="size-3.5" />
          {BILLING_COPY.addFunds}
        </Link>
      </Button>
    </div>
  );
}
