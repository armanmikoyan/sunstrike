import type { Transition } from "motion/react";
import { mediaByIds } from "@/mocks/media";
import type { LoginErrors } from "./types";

export const loginThumbnails = mediaByIds(["02", "16", "11"]);

export const CODE_LENGTH = 6;
export const MAX_CODE_ATTEMPTS = 5;
export const SENDING_PHASE_MS = 700;
export const CODE_BOX_STAGGER_MS = 60;
export const SENDS_BEFORE_WAIT = 3;
export const RESEND_COOLDOWN_SECONDS = 30;

export const STEP_SWAP: Transition = { duration: 0.22, ease: [0.32, 0.72, 0, 1] };
export const CODE_ENTRANCE: Transition = { type: "spring", stiffness: 240, damping: 22, mass: 0.9 };
export const CODE_DIGIT: Transition = { type: "spring", stiffness: 460, damping: 28, mass: 0.7 };

export const CODE_BOX_HIDDEN = { opacity: 0, y: 16, scale: 0.84 };
export const CODE_BOX_SHOWN = { opacity: 1, y: 0, scale: 1 };

export const CODE_EMPTY_TONE = {
  borderColor: "rgba(156, 242, 94, 0.22)",
  backgroundColor: "rgba(116, 240, 28, 0.04)",
  boxShadow: "0 0 0 rgba(116, 240, 28, 0)",
};

export const CODE_FILLED_TONE = {
  borderColor: "rgba(116, 240, 28, 0.55)",
  backgroundColor: "rgba(116, 240, 28, 0.1)",
  boxShadow: "0 0 18px rgba(116, 240, 28, 0.14)",
};

export const CODE_FOCUSED_TONE = {
  borderColor: "rgba(198, 249, 161, 0.85)",
  backgroundColor: "rgba(116, 240, 28, 0.09)",
  boxShadow: "0 0 0 3px rgba(116, 240, 28, 0.16)",
};

export const CODE_BUSY_TONE = {
  borderColor: "rgba(156, 242, 94, 0.85)",
  backgroundColor: "rgba(116, 240, 28, 0.16)",
  boxShadow: "0 0 22px rgba(116, 240, 28, 0.24)",
};

export const loginHeroId = "09";

export const loginErrors: LoginErrors = {
  callback: "Sign-in could not be completed. Try again.",
};

export const loginCopy = {
  brand: "Wildscape.ai",
  heroTitleBefore: "A studio for",
  heroTitleAccent: "directed frames",
  heroDescription: "Image and motion generation with real direction. No subscription, just pay for the work you make.",
  motion: "Motion 2",
  upscale: "4K upscale",
  copyright: "© 2026 Wildscape.ai · Pay as you go",
  backToStudio: "Back to studio",
  title: "Sign in to Wildscape",
  emailLabel: "Email",
  emailPlaceholder: "you@studio.com",
  codeLabel: "Code",
  sendCode: "Send code",
  sending: "Sending…",
  resendCode: "Resend code",
  resendIn: "Resend in {seconds}s",
  cooldownBefore: "Please wait ",
  cooldownAfter: " before requesting another code.",
  verifyCooldown: "Too many attempts. Try again in {seconds}s.",
  emailLimit: "Email limit reached. Try again later.",
  verifying: "Verifying…",
  connecting: "Connecting…",
  differentEmail: "Use a different email",
  codeSentBefore: "We sent a code to ",
  wrongCode: "That code is incorrect. {remaining} attempts left.",
  wrongCodeLast: "That code is incorrect. 1 attempt left.",
  tooManyCodes: "Too many incorrect codes. Choose how you want to sign in.",
  or: "or",
  google: "Continue with Google",
  github: "Continue with GitHub",
  termsBefore: "By continuing you agree to our ",
  terms: "Terms",
  termsAnd: " and ",
  privacy: "Privacy Policy",
  termsAfter: ".",
  footer: "Pay as you go · balance never expires",
  unreachable: "Could not reach the server. Try again.",
};
