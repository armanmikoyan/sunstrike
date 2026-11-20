"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { Button } from "@/ui/button";
import { COOKIE_CONSENT_COPY, EXIT_DURATION, REDUCED_MOTION_QUERY } from "./constants";
import type { ConsentChoice } from "./types";
import { useCookieConsent } from "./hooks";

/**
 * A single consent surface for the whole site. It sits above the page but
 * below the mobile drawer and portalled menus, and only appears after
 * hydration so the server and client markup match.
 */
export function CookieConsent() {
  const { open, decide } = useCookieConsent();
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const choose = useCallback(
    (choice: ConsentChoice) => {
      if (leaving) return;
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
        decide(choice);
        return;
      }
      setLeaving(true);
      timer.current = window.setTimeout(() => decide(choice), EXIT_DURATION);
    },
    [decide, leaving],
  );

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label={COOKIE_CONSENT_COPY.regionLabel}
      className={cn(
        "fixed inset-x-3 bottom-3 z-60 overflow-hidden rounded-2xl border border-white/10 glass-menu shadow-[0_1.5rem_3rem_-1.5rem_rgba(0,0,0,0.75)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-104",
        "duration-200 ease-out motion-reduce:animate-none",
        leaving ? "animate-out fade-out-0 slide-out-to-bottom-2" : "animate-in fade-in-0 slide-in-from-bottom-3",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/3.5 text-foreground/70"
        >
          <Cookie className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium tracking-[-0.02em]">
            {COOKIE_CONSENT_COPY.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground lg:text-[0.6875rem]">
            {COOKIE_CONSENT_COPY.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <Button
          variant="outline"
          onClick={() => choose("essential")}
          className="h-9 w-full rounded-lg border-white/9 bg-white/1.5 text-xs text-muted-foreground hover:bg-white/4.5 hover:text-foreground lg:text-[0.6875rem]"
        >
          {COOKIE_CONSENT_COPY.essential}
        </Button>
        <Button onClick={() => choose("all")} className="h-9 w-full rounded-lg px-3 text-xs lg:text-[0.6875rem]">
          {COOKIE_CONSENT_COPY.accept}
        </Button>
      </div>

      <div className="mt-4 border-t border-white/6 bg-white/2.5 px-4 py-2.5">
        <Link
          href="/privacy#cookies"
          className="text-xs text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline lg:text-[0.6875rem]"
        >
          {COOKIE_CONSENT_COPY.policyLink}
        </Link>
      </div>
    </div>
  );
}
