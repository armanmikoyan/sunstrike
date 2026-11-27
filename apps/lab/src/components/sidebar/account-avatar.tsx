"use client";

import { LogIn, UserRound } from "lucide-react";
import { cn } from "cn";
import { AVATAR_FRAME_CLASS, AVATAR_PLACEHOLDER_CLASS } from "./constants";
import type { AccountAvatarProps } from "./types";

export function AccountAvatar({ avatarUrl, variant = "user" }: AccountAvatarProps) {
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
      <span className={AVATAR_FRAME_CLASS}>
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
    <span className={cn(AVATAR_FRAME_CLASS, "grid place-items-center bg-white/8 text-foreground/70")}>
      <UserRound className="size-3.5" strokeWidth={2} />
    </span>
  );
}
