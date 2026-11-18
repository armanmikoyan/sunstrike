export const CONSENT_STORAGE_KEY = "chronolab:cookie-consent";

/** Fired after a choice is saved, so analytics can start or stay off. */
export const CONSENT_EVENT = "chronolab:cookie-consent";

export const COOKIE_CONSENT_COPY = {
  regionLabel: "Cookie consent",
  title: "Cookies,",
  titleAccent: "briefly",
  description:
    "Essential cookies keep you signed in and remember this choice. With your permission we also measure which pages and models get used, so the studio keeps improving.",
  policyLink: "Privacy policy",
  accept: "Accept all",
  essential: "Essential only",
};

/** Matches the exit animation, so the banner is still on screen while it plays. */
export const EXIT_DURATION = 160;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
