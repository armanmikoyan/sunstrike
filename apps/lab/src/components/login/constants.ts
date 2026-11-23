import type { LoginErrors, LoginProvider } from "./types";

export const loginThumbnailIds = ["02", "16", "11"];

export const CODE_LENGTH = 6;

/** Wrong codes allowed before the sign-in restarts from the email step. */
export const MAX_CODE_ATTEMPTS = 5;

/** How long the sending state stays before the code step replaces it. */
export const SENDING_PHASE_MS = 700;

/**
 * Delay between neighbouring code boxes as the step appears. Six boxes at 60ms
 * settle within 0.4s: a visible ripple, still one gesture rather than six.
 */
export const CODE_BOX_STAGGER_MS = 60;

export const loginProviders: LoginProvider[] = ["google", "github"];

export const loginHeroId = "09";

export const loginErrors: LoginErrors = {
  callback: "Sign-in could not be completed. Try again.",
};

export const loginCopy = {
  brand: "Chronolab.ai",
  heroTitleBefore: "A studio for",
  heroTitleAccent: "directed frames",
  heroDescription: "Image and motion generation with real direction. No subscription, just pay for the work you make.",
  motion: "Motion 2",
  upscale: "4K upscale",
  copyright: "© 2026 Chronolab.ai · Pay as you go",
  backToStudio: "Back to studio",
  title: "Sign in to Chronolab",
  emailLabel: "Email",
  emailPlaceholder: "you@studio.com",
  codeLabel: "Code",
  sendCode: "Send code",
  sending: "Sending…",
  cooldownBefore: "Please wait ",
  cooldownAfter: " before requesting another code.",
  verifyCooldown: "Too many attempts. Try again in {seconds}s.",
  verifying: "Verifying…",
  connecting: "Connecting…",
  differentEmail: "Use a different email",
  codeSentBefore: "We sent a code to ",
  codeSentAfter: ".",
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
