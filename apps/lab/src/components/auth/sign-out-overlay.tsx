"use client";

import { LoaderCircle } from "lucide-react";
import { AUTH_COPY } from "./constants";
import { useSignOutOverlay } from "./hooks";

export function SignOutOverlay() {
  const visible = useSignOutOverlay();

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={AUTH_COPY.signingOut}
      aria-busy="true"
      className="fixed inset-0 z-100 grid place-items-center bg-black/60 p-5 backdrop-blur-sm"
    >
      <div className="glass-menu flex w-full max-w-72 flex-col items-center gap-2 rounded-2xl border border-white/10 px-7 py-6 text-center">
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" />
        <p role="status" className="text-sm font-medium text-foreground">
          {AUTH_COPY.signingOut}
        </p>
        <p className="text-xs text-muted-foreground lg:text-[0.6875rem]">{AUTH_COPY.signingOutDetail}</p>
      </div>
    </div>
  );
}
