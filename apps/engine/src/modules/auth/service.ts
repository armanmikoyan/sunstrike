import * as supabase from "@/infrastructure/supabase";
import { users } from "@/modules/users";
import type { AuthSession, AuthSubject, OAuthProvider, OAuthStart, SessionUser } from "./types";
import { toAuthSubject, toSessionUser } from "./utils";

/** Validate a bearer token and return the subject it belongs to. */
export async function verify(token: string): Promise<AuthSubject | null> {
  const user = await supabase.verifyAccessToken(token);

  return user ? toAuthSubject(user) : null;
}

/**
 * Make sure the identity that owns this token has a profile row, and keep it in
 * step with the provider while we are there. The row is the application's copy
 * of identity: `email` mirrors Supabase, written only when it actually changed
 * so authenticated reads stay write-free; `avatarUrl` is a first-wins snapshot,
 * so switching providers never swaps the picture.
 *
 * Callers get the stored profile back rather than the claims, so a request
 * never works from a copy of the row that may already be stale.
 */
export async function ensureUser(subject: AuthSubject): Promise<SessionUser> {
  const existing = await users.getById(subject.authSubject);

  if (!existing) {
    const created = await users.provision({
      id: subject.authSubject,
      email: subject.email,
      avatarUrl: subject.avatarUrl,
    });

    return toSessionUser(created.id, created.email ?? undefined, created.avatarUrl);
  }

  if (subject.email && existing.email !== subject.email) await users.syncEmail(existing.id, subject.email);

  if (subject.avatarUrl && !existing.avatarUrl) await users.syncAvatar(existing.id, subject.avatarUrl);

  return toSessionUser(
    existing.id,
    subject.email ?? existing.email ?? undefined,
    existing.avatarUrl ?? subject.avatarUrl,
  );
}

export async function sendOtpCode(email: string): Promise<void> {
  await supabase.sendOtpCode(email);
}

export async function signInWithGoogleIdToken(token: string, nonce: string): Promise<AuthSession> {
  const session = await supabase.signInWithGoogleIdToken(token, nonce);
  const user = await ensureUser(toAuthSubject(session.user));

  return { ...session, user };
}

export async function verifyOtpCode(email: string, token: string): Promise<AuthSession> {
  const session = await supabase.verifyOtpCode(email, token);
  const user = await ensureUser(toAuthSubject(session.user));

  return { ...session, user };
}

export async function getSessionUser(accessToken: string): Promise<SessionUser | null> {
  const user = await supabase.verifyAccessToken(accessToken);

  return user ? ensureUser(toAuthSubject(user)) : null;
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const session = await supabase.refreshSession(refreshToken);
  const user = await ensureUser(toAuthSubject(session.user));

  return { ...session, user };
}

export async function signOut(accessToken: string): Promise<void> {
  await supabase.signOut(accessToken).catch(() => {});
}

export async function startOAuthSignIn(provider: OAuthProvider, redirectTo: string): Promise<OAuthStart> {
  return supabase.startOAuth(provider, redirectTo);
}

export async function completeOAuthSignIn(
  code: string,
  codeVerifier: string,
  flowId?: string | null,
): Promise<AuthSession> {
  const session = await supabase.exchangeCode(code, codeVerifier, flowId);
  const user = await ensureUser(toAuthSubject(session.user));

  return { ...session, user };
}
