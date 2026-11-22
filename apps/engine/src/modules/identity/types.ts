/** A verified authentication subject, before it is mapped to a user. */
export interface AuthSubject {
  authSubject: string;
  email?: string;
}

/** A raw `identities` row as returned by Postgres. */
export interface IdentityRow {
  id: string;
  auth_subject: string;
  user_id: string;
}

/** The mapping between an authentication subject and an application user. */
export interface IdentityRecord {
  id: string;
  authSubject: string;
  userId: string;
}

/** The authenticated identity attached to a request by `identity.requireAuth`. */
export interface AuthContext {
  userId: string;
  authSubject: string;
  email?: string;
}

export interface SessionUser {
  id: string;
  email: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: SessionUser;
}

export interface OAuthStart {
  url: string;
  codeVerifier: string;
  flowId: string | null;
}

export type OAuthProvider = "google" | "github" | "apple";

export interface OtpRequestBody {
  email?: unknown;
}

export interface OtpVerifyBody {
  email?: unknown;
  token?: unknown;
}

export interface GoogleIdTokenBody {
  credential?: unknown;
}

export interface RefreshBody {
  refreshToken?: unknown;
}

export interface OAuthBody {
  redirectTo?: unknown;
}

export interface CallbackBody {
  code?: unknown;
  codeVerifier?: unknown;
  flowId?: unknown;
}
