"use client";

import { useId } from "react";
import { LogIn, UserRound } from "lucide-react";
import { cn } from "cn";
import { AVATAR_FRAME_CLASS, AVATAR_PLACEHOLDER_CLASS } from "./constants";
import type { AccountAvatarProps } from "./types";

export function AccountAvatar({ avatarUrl, variant = "user" }: AccountAvatarProps) {
  const gradientId = useId();

  if (variant === "loading") {
    return <span className={cn(AVATAR_PLACEHOLDER_CLASS, "animate-pulse motion-reduce:animate-none")} />;
  }

  if (variant === "login") {
    return (
      <span className={cn(AVATAR_PLACEHOLDER_CLASS, "grid place-items-center text-foreground")}>
        <LogIn className="size-3.5" strokeWidth={1.8} />
      </span>
    );
  }

  if (avatarUrl) {
    return (
      <span className={cn(AVATAR_FRAME_CLASS, "overflow-hidden")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote provider avatar, no loader needed */}
        <img
          src={avatarUrl}
          alt=""
          width={28}
          height={28}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span className={cn(AVATAR_FRAME_CLASS, "grid place-items-center")}>
      <svg aria-hidden className="absolute size-0">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-tertiary)" />
            <stop offset="55%" stopColor="var(--brand-secondary)" />
            <stop offset="100%" stopColor="var(--brand)" />
          </linearGradient>
        </defs>
      </svg>
      <UserRound className="size-3.5" strokeWidth={2.2} stroke={`url(#${gradientId})`} />
    </span>
  );
}
