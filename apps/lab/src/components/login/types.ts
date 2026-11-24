import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { Transition } from "motion/react";
import type { OAuthProvider } from "@/app/api/auth/oauth/types";

export type LoginStep = "email" | "code";

export type LoginPending = "email" | "code" | OAuthProvider | null;

export type LoginErrors = Record<string, string>;

export type LoginProps = {
  next?: string;
  initialError?: string;
};

export type LoginOAuthButtonsProps = {
  pending: LoginPending;
  onSelect: (provider: OAuthProvider) => void;
};

export type LoginEmailStepProps = {
  active: boolean;
  email: string;
  emailValid: boolean;
  emailInputRef: RefObject<HTMLInputElement | null>;
  pending: LoginPending;
  cooldown: number;
  emailBlocked: boolean;
  transition: Transition;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type LoginCodeStepProps = {
  active: boolean;
  email: string;
  token: string;
  pending: LoginPending;
  resending: boolean;
  cooldown: number;
  emailBlocked: boolean;
  refocus: number;
  restart: number;
  transition: Transition;
  onTokenChange: (value: string) => void;
  onComplete: (code: string) => void;
  onUseDifferentEmail: () => void;
  onResend: () => void;
};

export type LoginFeedbackProps = {
  error: string;
  step: LoginStep;
  pending: LoginPending;
  resending: boolean;
  cooldown: number;
  limitedByServer: boolean;
};

export type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  labelledBy: string;
  disabled?: boolean;
  busy?: boolean;
  active?: boolean;
  refocus?: number;
  restart?: number;
};

export type UseCodeInputOptions = Pick<
  CodeInputProps,
  "value" | "onChange" | "onComplete" | "disabled" | "active" | "refocus" | "restart"
>;
