export interface SupabaseUser {
  id: string;
  email?: string;
  created_at?: string;
}

function config(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("Supabase is not configured");

  return { url: url.replace(/\/+$/, ""), key };
}

export async function verifyAccessToken(accessToken: string): Promise<SupabaseUser | null> {
  const { url, key } = config();

  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Supabase token check failed: ${response.status}`);

  return (await response.json()) as SupabaseUser;
}
