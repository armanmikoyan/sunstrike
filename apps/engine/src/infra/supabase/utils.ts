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

export function avatarFromMetadata(metadata: unknown): string | undefined {
  if (!metadata || typeof metadata !== "object") return undefined;

  const record = metadata as Record<string, unknown>;
  const value = record.avatar_url ?? record.picture;

  return typeof value === "string" && value ? value : undefined;
}

export function mapSession(session: Session | null): SupabaseSession {
  if (!session) throwAuthError(null, "No session");

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
    user: {
      id: session.user.id,
      email: session.user.email ?? undefined,
      avatarUrl: avatarFromMetadata(session.user.user_metadata),
    },
  };
}

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
