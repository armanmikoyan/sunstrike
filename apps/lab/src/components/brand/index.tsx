import Image from "next/image";
import { Link } from "@/components/link";
import { cn } from "cn";
import { BRAND_COPY, LOCKUP_HEIGHT, LOCKUP_SRC, LOCKUP_WIDTH, MARK_SIZE, MARK_SRC } from "./constants";
import type { BrandMarkProps, LogoLockupProps } from "./types";

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Image
      src={MARK_SRC}
      alt=""
      aria-hidden="true"
      width={MARK_SIZE}
      height={MARK_SIZE}
      unoptimized
      loading="eager"
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

export function LogoLockup({ className, href = "/", compact = false }: LogoLockupProps) {
  return (
    <Link href={href} className={cn("group flex items-center", className)} aria-label={BRAND_COPY.home}>
      <Image
        src={LOCKUP_SRC}
        alt=""
        width={LOCKUP_WIDTH}
        height={LOCKUP_HEIGHT}
        unoptimized
        loading="eager"
        className={cn("h-auto w-auto max-w-full", compact ? "max-h-11" : "max-h-16")}
      />
    </Link>
  );
}
