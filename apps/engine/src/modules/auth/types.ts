/** A verified authentication subject, before it is resolved to a user. */
export interface AuthSubject {
  authSubject: string;
  email?: string;
}

/** The authenticated caller attached to a request by `auth.requireAuth`. */
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

export type OAuthProvider = "google" | "github";

export interface OtpRequestBody {
  email?: unknown;
}

export interface OtpVerifyBody {
  email?: unknown;
  token?: unknown;
}

export interface GoogleIdTokenBody {
  credential?: unknown;
  nonce?: unknown;
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
