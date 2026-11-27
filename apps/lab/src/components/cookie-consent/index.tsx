"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import { Button } from "@/ui/button";
import { COOKIE_CONSENT_COPY } from "./constants";
import { useCookieConsent } from "./hooks";

export function CookieConsent() {
  const { open, leaving, choose } = useCookieConsent();

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
          <p className="text-sm font-medium tracking-[-0.02em]">{COOKIE_CONSENT_COPY.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground lg:text-[0.6875rem]">
            {COOKIE_CONSENT_COPY.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        <Button variant="subtle" size="lg" onClick={() => choose("essential")} className="w-full">
          {COOKIE_CONSENT_COPY.essential}
        </Button>
        <Button onClick={() => choose("all")} className="h-9 w-full rounded-lg px-3">
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
