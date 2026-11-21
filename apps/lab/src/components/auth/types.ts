export type SessionUser = {
  id: string;
  email: string | null;
};

export type SessionState = {
  user: SessionUser | null;
  loading: boolean;
};

export type SessionResponse = {
  user?: SessionUser;
};

export type ErrorMessageBody = {
  error?: unknown;
};
