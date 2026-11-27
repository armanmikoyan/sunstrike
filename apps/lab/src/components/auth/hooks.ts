"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SESSION_FRESH_MS, SIGN_OUT_MIN_MS, SIGNED_IN_EVENT, SIGNED_OUT_EVENT, SIGNING_OUT_EVENT } from "./constants";
import type { SessionResponse, SessionState } from "./types";

const LOADING: SessionState = { user: null, loading: true };
const SIGNED_OUT: SessionState = { user: null, loading: false };

let session: SessionState = LOADING;
let checkedAt: number | null = null;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function publish(next: SessionState) {
  session = next;
  for (const listener of listeners) listener();
}

let watching = false;

/**
 * Auth events update the shared session even while nothing is subscribed, so
 * a sign-in on a page without the account UI is not masked by a cached
 * signed-out state.
 */
function watchAuthEvents() {
  if (watching) return;
  watching = true;

  window.addEventListener(SIGNED_IN_EVENT, () => {
    checkedAt = null;
    // A check that started before the sign-in would report the old session.
    void (inFlight ? inFlight.then(refreshSession) : refreshSession());
  });
  window.addEventListener(SIGNED_OUT_EVENT, () => {
    checkedAt = Date.now();
    publish(SIGNED_OUT);
  });
  // Another tab may have signed in or out while this one was hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && listeners.size > 0) void refreshSession();
  });
}

function subscribe(listener: () => void) {
  watchAuthEvents();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => session;
const getServerSnapshot = () => LOADING;

/** `null` means the check itself failed, so nothing is cached. */
async function fetchSession(): Promise<SessionState | null> {
  try {
    const response = await fetch("/api/auth/session", { cache: "no-store" });

    if (!response.ok) return null;

    const body = (await response.json()) as SessionResponse;

    return { user: body.user ?? null, loading: false };
  } catch {
    return null;
  }
}

async function checkSession() {
  try {
    const next = await fetchSession();
    checkedAt = next ? Date.now() : null;
    publish(next ?? SIGNED_OUT);
  } finally {
    inFlight = null;
  }
}

function refreshSession(): Promise<void> {
  inFlight ??= checkSession();
  return inFlight;
}

function isFresh() {
  return checkedAt !== null && Date.now() - checkedAt < SESSION_FRESH_MS;
}

/** Test hook: forget the shared session between cases. */
export function resetSessionCache() {
  session = LOADING;
  checkedAt = null;
  inFlight = null;
}

export function useSessionUser(): SessionState {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!isFresh()) void refreshSession();
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
