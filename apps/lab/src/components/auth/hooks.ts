"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SIGNED_IN_EVENT, SIGNED_OUT_EVENT, SIGNING_OUT_EVENT } from "./constants";
import type { SessionResponse, SessionState } from "./types";

let inFlight: Promise<SessionState> | null = null;

async function fetchSession(): Promise<SessionState> {
  try {
    const response = await fetch("/api/auth/session", { cache: "no-store" });

    if (!response.ok) return { user: null, loading: false };

    const body = (await response.json()) as SessionResponse;

    return { user: body.user ?? null, loading: false };
  } catch {
    return { user: null, loading: false };
  }
}

/**
 * One request per burst: every component mounting on the same render shares
 * this promise instead of hitting the BFF separately. It is dropped once it
 * settles, so a later mount (e.g. after navigation) still revalidates.
 */
function loadSession(): Promise<SessionState> {
  inFlight ??= fetchSession().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

export function useSessionUser(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, loading: true });

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const session = await loadSession();

      if (active) setState(session);
    }

    void hydrate();

    const signedOut = () => setState({ user: null, loading: false });
    const signedIn = () => void hydrate();

    window.addEventListener(SIGNED_IN_EVENT, signedIn);
    window.addEventListener(SIGNED_OUT_EVENT, signedOut);

    return () => {
      active = false;
      window.removeEventListener(SIGNED_IN_EVENT, signedIn);
      window.removeEventListener(SIGNED_OUT_EVENT, signedOut);
    };
  }, []);

  return state;
}

export function useSignOut() {
  const [pending, setPending] = useState(false);

  const signOut = useCallback(async () => {
    setPending(true);
    window.dispatchEvent(new Event(SIGNING_OUT_EVENT));

    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } finally {
      window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
      setPending(false);
    }
  }, []);

  return { signOut, pending };
}

export function useLoginHref(): string {
  const pathname = usePathname();

  return pathname === "/" ? "/login" : `/login?next=${encodeURIComponent(pathname)}`;
}

export function useRequireAuth(): SessionState {
  const state = useSessionUser();
  const [signedOut, setSignedOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onSignedOut = () => setSignedOut(true);
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);

    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
  }, []);

  useEffect(() => {
    if (state.loading || state.user) return;

    if (signedOut) {
      router.replace("/");
      return;
    }

    const next = `${pathname}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [pathname, router, signedOut, state.loading, state.user]);

  return state;
}
