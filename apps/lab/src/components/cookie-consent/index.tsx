"use client";

import Link from "next/link";
import { Button } from "@/ui/button";
import { cookieConsentCopy } from "./constants";
import { useCookieConsent } from "./hooks";

/**
 * A single consent surface for the whole site. It sits above the page but
 * below the mobile drawer and portalled menus, and only appears after
 * hydration so the server and client markup match.
 */
export function CookieConsent() {
  const { open, decide } = useCookieConsent();

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label={cookieConsentCopy.regionLabel}
      className="fixed inset-x-4 bottom-4 z-[60] rounded-xl border border-white/[0.09] glass-menu p-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[22rem]"
    >
      <p className="text-sm font-medium tracking-[-0.02em]">
        {cookieConsentCopy.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground lg:text-[0.6875rem]">
        {cookieConsentCopy.description}{" "}
        <Link
          href="/privacy#cookies"
          className="text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {cookieConsentCopy.policyLink}
        </Link>
      </p>
      <div className="mt-3.5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => decide("essential")}
          className="h-9 rounded-lg border-white/[0.09] bg-white/[0.015] text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
        >
          {cookieConsentCopy.essential}
        </Button>
        <Button
          onClick={() => decide("all")}
          className="h-9 rounded-lg px-3 text-xs lg:text-[0.6875rem]"
        >
          {cookieConsentCopy.accept}
        </Button>
      </div>
    </div>
  );
}
