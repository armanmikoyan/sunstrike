"use client";

import { useId } from "react";
import { UserRound } from "lucide-react";

export function AccountAvatar() {
  const gradientId = useId();

  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-brand-secondary/80 shadow-[0_0_0_1px_rgba(167,139,250,0.18),0_0_12px_rgba(167,139,250,0.22)]">
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
