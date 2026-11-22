"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSessionUser } from "./hooks";
import { reloadPage } from "./utils";
import type { GoogleCredentialResponse, GoogleWindow } from "./types";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function GoogleOneTap() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const { user, loading } = useSessionUser();
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && Boolean((window as GoogleWindow).google?.accounts?.id),
  );
  const started = useRef(false);

  useEffect(() => {
    if (!clientId || loading || user || !ready || started.current) return;

    const id = (window as GoogleWindow).google?.accounts?.id;
    if (!id) return;

    started.current = true;
    id.initialize({
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        if (!response.credential) return;

        try {
          const result = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
          });

          if (!result.ok) return;

          reloadPage();
        } catch {
          return;
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    id.prompt();
  }, [clientId, loading, ready, user]);

  if (!clientId) return null;

  return <Script src={SCRIPT_SRC} strategy="afterInteractive" onLoad={() => setReady(true)} />;
}
