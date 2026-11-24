import { createClient, type Provider, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/infrastructure/config";
import type { OAuthStart, SupabaseSession, SupabaseUser } from "./types";
import { authOptions, avatarFromMetadata, createVerifierStorage, mapSession, throwAuthError } from "./utils";

export type { OAuthStart, SupabaseSession, SupabaseUser } from "./types";

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(config.supabaseUrl(), config.supabaseKey(), authOptions());
  }

  return client;
}

export async function verifyAccessToken(accessToken: string): Promise<SupabaseUser | null> {
  const { data, error } = await getClient().auth.getClaims(accessToken);

  if (error) {
    if (error.status === 401 || error.status === 403 || error.code === "invalid_jwt") return null;

    throw error;
  }

  if (!data) return null;

  const metadata = (data.claims as { user_metadata?: unknown }).user_metadata;

  return { id: data.claims.sub, email: data.claims.email, avatarUrl: avatarFromMetadata(metadata) };
}

export async function sendOtpCode(email: string): Promise<void> {
  const { error } = await getClient().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) throwAuthError(error, "Could not send the code");
}

export async function signInWithGoogleIdToken(token: string, nonce: string): Promise<SupabaseSession> {
  const { data, error } = await getClient().auth.signInWithIdToken({
    provider: "google",
    token,
    nonce,
  });

  if (error) throwAuthError(error, "Could not sign in with Google");

  return mapSession(data.session);
}

export async function verifyOtpCode(email: string, token: string): Promise<SupabaseSession> {
  const { data, error } = await getClient().auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) throwAuthError(error, "Could not verify the code");

  return mapSession(data.session);
}

export async function refreshSession(refreshToken: string): Promise<SupabaseSession> {
  const { data, error } = await getClient().auth.refreshSession({ refresh_token: refreshToken });

  if (error) throwAuthError(error, "Could not refresh the session");

  return mapSession(data.session);
}

export async function signOut(accessToken: string): Promise<void> {
  const base = config.supabaseUrl().replace(/\/$/, "");

  const response = await fetch(`${base}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: config.supabaseKey(),
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throwAuthError({ status: response.status }, "Could not sign out");
}

export async function startOAuth(provider: Provider, redirectTo: string): Promise<OAuthStart> {
  const verifier = createVerifierStorage();

  const oauth = createClient(config.supabaseUrl(), config.supabaseKey(), {
    auth: { ...authOptions().auth, persistSession: true, storage: verifier.storage },
  });

  const { data, error } = await oauth.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error || !data.url) throwAuthError(error, "Could not start sign in");

  return {
    url: data.url,
    codeVerifier: verifier.read(),
    flowId: data.flowId ?? null,
  };
}

export async function exchangeCode(
  code: string,
  codeVerifier: string,
  flowId?: string | null,
): Promise<SupabaseSession> {
  const verifier = createVerifierStorage(codeVerifier);

  const oauth = createClient(config.supabaseUrl(), config.supabaseKey(), {
    auth: { ...authOptions().auth, persistSession: true, storage: verifier.storage },
  });

  const { data, error } = await oauth.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);

  if (error) throwAuthError(error, "Could not complete sign in");

  return mapSession(data.session);
}
