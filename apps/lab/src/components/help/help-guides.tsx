import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IconBox } from "@/ui/icon-box";
import { HELP_GUIDES } from "./constants";

export function HelpGuides() {
  return (
    <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {HELP_GUIDES.map((guide) => {
        const Icon = guide.icon;
        return (
          <Link
            key={guide.title}
            href={guide.href}
            className="group rounded-xl border border-white/7 bg-white/1.5 p-4 transition-colors hover:border-white/20 hover:bg-white/3"
          >
            <div className="flex items-start justify-between">
              <IconBox>
                <Icon className="size-3.5" strokeWidth={1.8} />
              </IconBox>
              <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-5 text-xs lg:text-[0.6875rem] font-medium">{guide.title}</p>
            <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
