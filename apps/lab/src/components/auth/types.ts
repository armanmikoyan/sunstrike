export type AuthProvider = "google" | "github" | "apple";

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

export type OAuthUrlResponse = {
  url?: unknown;
};

export type OAuthStartResult = { ok: true; url: string } | { ok: false; error: string };

export type ProviderIconProps = {
  provider: AuthProvider;
  className?: string;
};

export type GoogleCredentialResponse = {
  credential?: string;
};

export type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  prompt: () => void;
};

export type GoogleWindow = Window & {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
};
