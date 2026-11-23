"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { AUTH_COPY, SIGN_OUT_MIN_MS, SIGNED_OUT_EVENT, SIGNING_OUT_EVENT } from "./constants";

/**
 * Global sign-out acknowledgement. It listens for the events `useSignOut`
 * dispatches, so every account menu gets the same modal without each one
 * rendering its own copy.
 */
export function SignOutOverlay() {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const show = () => {
      if (hideTimer.current !== null) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }

      shownAt.current = Date.now();
      setVisible(true);
    };

    const hide = () => {
      if (hideTimer.current !== null) return;

      // The request usually finishes in a blink; hold the overlay long enough
      // that the user actually sees what happened.
      const remaining = SIGN_OUT_MIN_MS - (Date.now() - shownAt.current);

      if (remaining <= 0) {
        setVisible(false);
        return;
      }

      hideTimer.current = window.setTimeout(() => {
        hideTimer.current = null;
        setVisible(false);
      }, remaining);
    };

    window.addEventListener(SIGNING_OUT_EVENT, show);
    window.addEventListener(SIGNED_OUT_EVENT, hide);

    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);

      window.removeEventListener(SIGNING_OUT_EVENT, show);
      window.removeEventListener(SIGNED_OUT_EVENT, hide);
    };
  }, []);

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
