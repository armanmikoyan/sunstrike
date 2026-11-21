export interface SupabaseUser {
  id: string;
  email?: string;
}

export interface SupabaseSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: SupabaseUser;
}

export interface OAuthStart {
  url: string;
  codeVerifier: string;
  flowId: string | null;
}
