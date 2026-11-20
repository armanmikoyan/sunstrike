import { verifyAccessToken } from "@/infrastructure/supabase";
import type { IdentityUser } from "./types";

export async function resolveUser(accessToken: string): Promise<IdentityUser | null> {
  const user = await verifyAccessToken(accessToken);

  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    createdAt: user.created_at ?? "",
  };
}
