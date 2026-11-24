"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SIGN_OUT_MIN_MS, SIGNED_IN_EVENT, SIGNED_OUT_EVENT, SIGNING_OUT_EVENT } from "./constants";
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

export function useSignOutOverlay(): boolean {
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

  return visible;
}
