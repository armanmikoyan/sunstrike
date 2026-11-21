import type { Session } from "@supabase/supabase-js";
import type { SupabaseSession } from "./types";

export function authOptions() {
  return {
    auth: {
      flowType: "pkce" as const,
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  };
}

export function throwAuthError(error: { message?: string; status?: number } | null, fallback: string): never {
  throw Object.assign(new Error(error?.message ?? fallback), { status: error?.status ?? 401 });
}

export function mapSession(session: Session | null): SupabaseSession {
  if (!session) throwAuthError(null, "No session");

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
    user: { id: session.user.id, email: session.user.email ?? undefined },
  };
}

/**
 * PKCE keeps the code verifier in the client's storage. This adapter holds it
 * in a local variable so a stateless server can start and finish a flow: the
 * start call returns the verifier, the caller stores it, and the callback
 * hands it back.
 */
export function createVerifierStorage(initial = "") {
  let value = initial;

  return {
    read: () => value,
    storage: {
      getItem: (key: string) => (key.endsWith("-code-verifier") ? value : null),
      setItem: (key: string, next: string) => {
        if (key.endsWith("-code-verifier")) value = next;
      },
      removeItem: (key: string) => {
        if (key.endsWith("-code-verifier")) value = "";
      },
    },
  };
}
