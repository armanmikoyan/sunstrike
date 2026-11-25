import Image from "next/image";
import { WandSparkles } from "lucide-react";
import { cn } from "cn";
import type { StudioModelLogoProps } from "./types";

export function StudioModelLogo({ vendor, className }: StudioModelLogoProps) {
  if (vendor?.logoUrl) {
    return (
      <Image
        src={vendor.logoUrl}
        alt=""
        width={16}
        height={16}
        className={cn("size-4 shrink-0 rounded-sm object-contain", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm bg-white/8 text-[0.5625rem] font-medium uppercase text-muted-foreground",
        className,
      )}
    >
      {vendor ? vendor.name.charAt(0) : <WandSparkles className="size-2.5" />}
    </span>
  );
}
