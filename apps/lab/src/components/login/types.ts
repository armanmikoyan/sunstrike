export type LoginStep = "email" | "code";

export type LoginProvider = "google" | "github" | "apple";

export type LoginPending = "email" | "code" | LoginProvider | null;

export type LoginErrors = Record<string, string>;

export type OAuthUrlResponse = {
  url?: unknown;
};

export type LoginProps = {
  next?: string;
  initialError?: string;
};

export type ProviderIconProps = {
  provider: LoginProvider;
  className?: string;
};
