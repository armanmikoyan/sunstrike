"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GOOGLE_ONE_TAP_SCRIPT_SRC } from "./constants";
import { useSessionUser } from "./hooks";
import { safeNext } from "@/app/api/auth/utils";
import { navigate, reloadPage, startGoogleOneTap, supportsGoogleOneTap } from "./utils";
import type { GoogleWindow } from "./types";

export function GoogleOneTap() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const pathname = usePathname();
  const { user, loading } = useSessionUser();
  const started = useRef(false);

  useEffect(() => {
    if (!user) return;

    started.current = false;
    (window as GoogleWindow).google?.accounts?.id?.cancel();
  }, [user]);

  function handleReady() {
    if (!clientId || started.current || loading || user || !supportsGoogleOneTap()) return;

    const googleId = (window as GoogleWindow).google?.accounts?.id;
    if (!googleId) return;

    started.current = true;
    startGoogleOneTap(googleId, clientId, handleSuccess);
  }

  function handleSuccess() {
    if (pathname !== "/login") {
      reloadPage();
      return;
    }

    navigate(safeNext(new URLSearchParams(window.location.search).get("next")));
  }

  if (!clientId || loading || user) return null;

  return <Script src={GOOGLE_ONE_TAP_SCRIPT_SRC} strategy="afterInteractive" onReady={handleReady} />;
}
