import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LOCKUP_HEIGHT,
  LOCKUP_SRC,
  LOCKUP_WIDTH,
  MARK_POSTER_SIZE,
  MARK_POSTER_SRC,
} from "./constants";

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
}: {
  className?: string;
  duration?: number;
}) {
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
      <violet-orb
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
}: {
  className?: string;
  href?: string;
  compact?: boolean;
  /** Kept in the layout for a reveal transition but out of reach. */
  inactive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center", className)}
      aria-label="Chronolab.ai home"
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
        className={cn("w-auto", compact ? "h-11" : "h-16")}
      />
    </Link>
  );
}
