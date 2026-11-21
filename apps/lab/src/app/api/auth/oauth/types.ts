export type OAuthProvider = "google" | "github" | "apple";

export type OAuthCookie = {
  codeVerifier: string;
  flowId: string | null;
  next: string;
};

export type OAuthStart = {
  url: string;
  codeVerifier: string;
  flowId: string | null;
};

export type OAuthRouteContext = {
  params: Promise<{ provider: string }>;
};
