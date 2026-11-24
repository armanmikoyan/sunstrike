import type { UserProfile, UserRow } from "./types";

export function mapUserRow(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}
