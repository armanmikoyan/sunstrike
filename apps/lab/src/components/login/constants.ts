import type { LoginErrors, LoginProvider } from "./types";

export const loginThumbnailIds = ["02", "16", "11"];

export const loginProviders: LoginProvider[] = ["google", "github", "apple"];

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
  codePlaceholder: "123456",
  sendCode: "Send code",
  verifyCode: "Verify code",
  sending: "Sending…",
  verifying: "Verifying…",
  connecting: "Connecting…",
  differentEmail: "Use a different email",
  codeSent: "We sent a code to {email}.",
  or: "or",
  google: "Continue with Google",
  github: "Continue with GitHub",
  apple: "Continue with Apple",
  termsBefore: "By continuing you agree to our ",
  terms: "Terms",
  termsAnd: " and ",
  privacy: "Privacy Policy",
  termsAfter: ".",
  footer: "Pay as you go · balance never expires",
  unreachable: "Could not reach the server. Try again.",
};
