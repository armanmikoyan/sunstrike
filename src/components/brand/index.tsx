import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import {
  LOCKUP_HEIGHT,
  LOCKUP_SRC,
  LOCKUP_WIDTH,
  MARK_POSTER_SIZE,
  MARK_POSTER_SRC,
  brandCopy,
} from "./constants";
import type { ChronosphereProps, LogoLockupProps, VioletOrbProps } from "./types";

/**
 * `violet-orb` is a custom element registered by `/brand/violet-orb.js`. The
 * cast keeps the runtime tag a string while letting JSX type its attributes;
 * no global JSX augmentation is needed.
 */
const VioletOrb = "violet-orb" as unknown as FC<VioletOrbProps>;

/**
 * The rotating chronosphere. The still poster holds the slot until the violet
 * orb script upgrades the element, when WebGL is unavailable, and while the
 * visitor prefers reduced motion.
 *
 * `duration` is seconds per revolution. Slower reads calmer at nav size, where
 * a quick spin looks like a flicker rather than a rotation.
 */
export function Chronosphere({
  className,
  duration = 18,
}: ChronosphereProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative grid shrink-0 place-items-center", className)}
    >
      <Image
        src={MARK_POSTER_SRC}
        alt=""
        width={MARK_POSTER_SIZE}
        height={MARK_POSTER_SIZE}
        unoptimized
        className="absolute inset-0 size-full object-contain"
      />
      <VioletOrb
        duration={String(duration)}
        className="relative size-full"
      />
    </span>
  );
}

export function LogoLockup({
  className,
  href = "/",
  compact = false,
  inactive = false,
}: LogoLockupProps) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center", className)}
      aria-label={brandCopy.home}
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
        className={cn(
          "h-auto w-auto max-w-full",
          compact ? "max-h-11" : "max-h-16",
        )}
      />
    </Link>
  );
}
