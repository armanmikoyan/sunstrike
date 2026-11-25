import type { Request } from "express";
import type { SupabaseUser } from "@/infra/supabase/types";
import type { AuthSubject, SessionUser } from "./types";

export function bearer(request: Request): string | null {
  const [scheme, token] = (request.header("authorization") ?? "").split(" ");

  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}

export function toSessionUser(id: string, email?: string, avatarUrl?: string | null): SessionUser {
  return { id, email: email ?? null, avatarUrl: avatarUrl ?? null };
}

/**
 * The Supabase subject is the application user id, so a verified identity
 * becomes the subject `ensureUser` works from by renaming its id and carrying
 * the two facts a profile mirrors.
 */
export function toAuthSubject(user: SupabaseUser): AuthSubject {
  return { authSubject: user.id, email: user.email, avatarUrl: user.avatarUrl };
}
