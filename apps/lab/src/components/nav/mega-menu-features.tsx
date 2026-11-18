import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IconBox } from "@/ui/icon-box";
import type { MegaMenuFeaturesProps } from "./types";

export function MegaMenuFeatures({ features, onClose }: MegaMenuFeaturesProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-white/7 p-4 sm:grid-cols-2 lg:border-b-0 lg:border-r">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Link
            key={feature.name}
            href={feature.href}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-white/4.5"
          >
            <IconBox className="mt-0.5 bg-white/3 transition-colors group-hover:bg-white/6 group-hover:text-foreground">
              <Icon className="size-3.75" strokeWidth={1.8} />
            </IconBox>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm lg:text-xs font-medium text-foreground">
                {feature.name}
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-0.5 block text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
                {feature.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
