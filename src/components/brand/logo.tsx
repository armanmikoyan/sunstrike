import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOCKUP_SRC = "/brand/sunstrike-logo.svg";
const LOCKUP_WIDTH = 2400;
const LOCKUP_HEIGHT = 735;
const MARK_SRC = "/brand/sunstrike-icon.svg";

/** The text-free sun mark, sized by the caller. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={MARK_SRC}
      alt=""
      width={1024}
      height={1024}
      unoptimized
      className={cn("size-9 shrink-0 object-contain", className)}
    />
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
      aria-label="Sunstrike.ai home"
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
