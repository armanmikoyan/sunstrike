import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/ui/button";
import type { MegaMenuIntroProps } from "./types";

export function MegaMenuIntro({ menu, onClose }: MegaMenuIntroProps) {
  return (
    <div className="flex flex-col justify-between border-b border-white/7 p-6 lg:border-b-0 lg:border-r">
      <div>
        <div className="mb-4 text-xs lg:text-[0.6875rem] text-muted-foreground">{menu.eyebrow}</div>
        <h2 className="max-w-55 text-[1.5625rem] font-medium leading-[1.1] tracking-[-0.03em]">{menu.title}</h2>
        <p className="mt-3 max-w-57.5 text-sm lg:text-xs leading-relaxed text-muted-foreground">{menu.description}</p>
      </div>
      <Button
        asChild
        variant="outline"
        className="mt-6 w-fit rounded-lg border-white/10 bg-white/3.5 text-xs lg:text-[0.6875rem] hover:border-white/20 hover:bg-white/6 hover:text-foreground"
      >
        <Link href={menu.href} onClick={onClose}>
          {menu.cta}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}
