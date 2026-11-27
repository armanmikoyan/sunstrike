import { Link } from "@/components/link";
import { ArrowRight } from "lucide-react";
import { MEGA_MENU_COPY } from "./constants";
import type { MegaMenuFooterProps } from "./types";

export function MegaMenuFooter({ onClose }: MegaMenuFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/7 bg-white/1.5 px-6 py-3">
      <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{MEGA_MENU_COPY.priceNote}</p>
      <div className="flex items-center gap-4">
        <Link
          href="/explore"
          onClick={onClose}
          className="text-xs lg:text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {MEGA_MENU_COPY.recentGenerations}
        </Link>
        <Link
          href="/pricing"
          onClick={onClose}
          className="flex items-center gap-1 text-xs lg:text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {MEGA_MENU_COPY.payg}
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
