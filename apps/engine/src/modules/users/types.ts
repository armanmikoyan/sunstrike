/** A raw `users` row as returned by Postgres. */
export interface UserRow {
  id: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

/** The application profile that other modules and the UI read. */
export interface UserProfile {
  id: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

/** The minimum needed to create or refresh a profile on first sign-in. */
export interface ProvisionUserInput {
  id: string;
  email?: string;
  avatarUrl?: string;
}
