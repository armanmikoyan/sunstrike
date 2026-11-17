export type ConsentChoice = "all" | "essential";

export const consentStorageKey = "chronolab:cookie-consent";

/** Fired after a choice is saved, so analytics can start or stay off. */
export const consentEvent = "chronolab:cookie-consent";

export const cookieConsentCopy = {
  regionLabel: "Cookie consent",
  title: "Cookies on Chronolab.ai",
  description:
    "Strictly necessary cookies keep the studio signed in and remember this choice. With your permission we also measure which models and pages get used.",
  policyLink: "Privacy policy",
  accept: "Accept all",
  essential: "Essential only",
};
