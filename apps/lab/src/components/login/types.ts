import type { AuthProvider } from "@/components/auth/types";

export type LoginStep = "email" | "code";

export type LoginProvider = AuthProvider;

export type LoginPending = "email" | "code" | LoginProvider | null;

export type LoginErrors = Record<string, string>;

export type LoginProps = {
  next?: string;
  initialError?: string;
};

export type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  labelledBy: string;
  disabled?: boolean;
  busy?: boolean;
  /** Drives the staggered entrance; false leaves the boxes hidden. */
  active?: boolean;
  /** Increment to move the caret to the last box (after a wrong code). */
  refocus?: number;
};
