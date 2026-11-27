import { Link } from "@/components/link";
import { ArrowUpRight } from "lucide-react";
import { HELP_GUIDES } from "./constants";

export function HelpGuides() {
  return (
    <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-3">
      {HELP_GUIDES.map((guide) => (
        <Link key={guide.title} href={guide.href} className="group block">
          <p className="flex items-center gap-1.5 text-sm font-medium tracking-[-0.01em]">
            {guide.title}
            <ArrowUpRight className="size-3 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </p>
          <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">{guide.description}</p>
        </Link>
      ))}
    </div>
  );
}
