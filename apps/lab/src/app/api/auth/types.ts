export type OtpAccepted = {
  ok: boolean;
};

export type SessionUser = {
  id: string;
  email: string | null;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: SessionUser;
};

export type SessionTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};
