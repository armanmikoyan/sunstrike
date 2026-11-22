import type { AuthProvider } from "@/components/auth/types";

export type LoginStep = "email" | "code";

export type LoginProvider = AuthProvider;

export type LoginPending = "email" | "code" | LoginProvider | null;

export type LoginErrors = Record<string, string>;

export type LoginProps = {
  next?: string;
  initialError?: string;
};
