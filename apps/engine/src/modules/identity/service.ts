import * as supabase from "@/infrastructure/supabase";
import { users } from "@/modules/users";
import * as repository from "./repository";
import type { AuthSession, AuthSubject, OAuthProvider, OAuthStart, SessionUser } from "./types";
import { toSessionUser } from "./utils";

/** Validate a bearer token and return the subject it belongs to. */
export async function verify(token: string): Promise<AuthSubject | null> {
  const user = await supabase.verifyAccessToken(token);

  if (!user) return null;

  return { authSubject: user.id, email: user.email };
}

export async function resolve(authSubject: string, email?: string): Promise<string> {
  const existing = await repository.findBySubject(authSubject);

  if (existing) {
    await users.syncEmail(existing.userId, email);

    return existing.userId;
  }

  const user = await users.provision({ id: authSubject, email });
  await repository.insert(authSubject, user.id);

  const created = await repository.findBySubject(authSubject);

  return created?.userId ?? user.id;
}

export async function sendOtpCode(email: string): Promise<void> {
  await supabase.sendOtpCode(email);
}

export async function signInWithGoogleIdToken(token: string, nonce: string): Promise<AuthSession> {
  const session = await supabase.signInWithGoogleIdToken(token, nonce);
  const userId = await resolve(session.user.id, session.user.email);

  return { ...session, user: toSessionUser(userId, session.user.email) };
}

export async function verifyOtpCode(email: string, token: string): Promise<AuthSession> {
  const session = await supabase.verifyOtpCode(email, token);
  const userId = await resolve(session.user.id, session.user.email);

  return { ...session, user: toSessionUser(userId, session.user.email) };
}

export async function getSessionUser(accessToken: string): Promise<SessionUser | null> {
  const user = await supabase.verifyAccessToken(accessToken);

  if (!user) return null;

  const userId = await resolve(user.id, user.email);

  return toSessionUser(userId, user.email);
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const session = await supabase.refreshSession(refreshToken);
  const userId = await resolve(session.user.id, session.user.email);

  return { ...session, user: toSessionUser(userId, session.user.email) };
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
  const userId = await resolve(session.user.id, session.user.email);

  return { ...session, user: toSessionUser(userId, session.user.email) };
}
