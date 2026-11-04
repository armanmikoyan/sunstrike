"use client";

import { useNavigationProgress } from "./hooks";

export function NavigationProgress() {
  const { visible, progress } = useNavigationProgress();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[200] h-[0.1875rem] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-brand-secondary transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
