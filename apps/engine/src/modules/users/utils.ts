import type { UserProfile, UserRow } from "./types";

export function mapUserRow(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

export function unauthorized() {
  return Object.assign(new Error("Unauthorized"), { status: 401 });
}

export function notFound(message: string) {
  return Object.assign(new Error(message), { status: 404 });
}
