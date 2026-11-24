import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";
import {
  LOCKUP_HEIGHT,
  LOCKUP_SRC,
  LOCKUP_WIDTH,
  MARK_POSTER_SIZE,
  MARK_POSTER_SRC,
  BRAND_COPY,
  VIOLET_ORB,
} from "./constants";
import type { ChronosphereProps, LogoLockupProps } from "./types";

export function Chronosphere({ className, duration = 18 }: ChronosphereProps) {
  return (
    <span aria-hidden="true" className={cn("relative grid shrink-0 place-items-center", className)}>
      <Image
        src={MARK_POSTER_SRC}
        alt=""
        width={MARK_POSTER_SIZE}
        height={MARK_POSTER_SIZE}
        unoptimized
        className="absolute inset-0 size-full object-contain"
      />
      <VIOLET_ORB duration={String(duration)} className="relative size-full" />
    </span>
  );
}

export function LogoLockup({
  className,
  imageClassName,
  href = "/",
  compact = false,
  inactive = false,
}: LogoLockupProps) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center", className)}
      aria-label={BRAND_COPY.home}
      aria-hidden={inactive || undefined}
      tabIndex={inactive ? -1 : undefined}
    >
      <Image
        src={LOCKUP_SRC}
        alt=""
        width={LOCKUP_WIDTH}
        height={LOCKUP_HEIGHT}
        unoptimized
        loading="eager"
        className={cn("h-auto w-auto max-w-full", compact ? "max-h-11" : "max-h-16", imageClassName)}
      />
    </Link>
  );
}
