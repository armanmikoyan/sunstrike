"use client";

import { useNavigationProgress } from "./hooks";

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
        className="h-full origin-left bg-brand transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
