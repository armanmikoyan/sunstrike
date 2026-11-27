"use client";

import type { CSSProperties } from "react";
import { useNavigationProgress } from "./hooks";

/* Kept inline so the bar can never go invisible if a stylesheet chunk is stale.
   The gradient's bright end sits at the leading edge of the scaleX fill. */
const FILL: CSSProperties = {
  backgroundImage: "linear-gradient(90deg, var(--brand-secondary) 0%, var(--brand) 55%, var(--brand-tertiary) 100%)",
  boxShadow:
    "0 0 10px color-mix(in oklab, var(--brand) 65%, transparent), 0 0 2px color-mix(in oklab, var(--brand-tertiary) 85%, transparent)",
};

export function NavigationProgress() {
  const { visible, progress } = useNavigationProgress();

  return (
    <div
      aria-hidden="true"
      data-navigation-progress
      className={`pointer-events-none fixed inset-x-0 top-0 z-200 h-[1.5px] transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full origin-left transition-transform duration-200 ease-out will-change-transform"
        style={{ ...FILL, transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
