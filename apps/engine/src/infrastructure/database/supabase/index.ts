import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseUser } from "./types";

export type { SupabaseUser } from "./types";

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) throw new Error("Supabase is not configured");

    client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
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

  return { id: data.claims.sub, email: data.claims.email };
}
