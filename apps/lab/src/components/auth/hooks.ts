"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SessionResponse, SessionState } from "./types";

const SIGNED_OUT_EVENT = "identity:signed-out";

export function useSessionUser(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/auth/session", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          if (!controller.signal.aborted) setState({ user: null, loading: false });
          return;
        }

        const body = (await response.json()) as SessionResponse;

        if (!controller.signal.aborted) {
          setState({ user: body.user ?? null, loading: false });
        }
      } catch {
        if (!controller.signal.aborted) setState({ user: null, loading: false });
      }
    }

    const signedOut = () => setState({ user: null, loading: false });

    load();
    window.addEventListener(SIGNED_OUT_EVENT, signedOut);

    return () => {
      controller.abort();
      window.removeEventListener(SIGNED_OUT_EVENT, signedOut);
    };
  }, []);

  return state;
}

export function useSignOut() {
  const [pending, setPending] = useState(false);

  const signOut = useCallback(async () => {
    setPending(true);

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
