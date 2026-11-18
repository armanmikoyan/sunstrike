import type { LegalDocument } from "./types";

/** The date shown on both documents and used as their sitemap timestamp. */
export const LEGAL_UPDATED = {
  label: "17 November 2026",
  iso: "2026-11-17",
};

export const PRIVACY_DOCUMENT: LegalDocument = {
  eyebrow: "Legal",
  title: "Privacy policy",
  description:
    "What the studio collects, why it keeps it and the choices you have over your prompts, frames and account.",
  updated: LEGAL_UPDATED.label,
  updatedIso: LEGAL_UPDATED.iso,
  contactEmail: "privacy@chronolab.ai",
  sections: [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        "Chronolab.ai turns prompts into images and motion. This policy explains what we collect when you use the site and the studio, why we keep it, and what you can ask us to do with it.",
        "It covers chronolab.ai and every screen behind it. Where a third party processes data for us, that processor is named in Sharing below.",
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      paragraphs: ["We collect the details you give us and the details the studio produces while you work."],
      bullets: [
        "Account details: your email address, your account id and the date you joined.",
        "Generation data: prompts, settings, references you upload and the frames or clips you keep.",
        "Balance and payments: top-ups, charges and invoices. Card details go to our payment provider and never reach our servers.",
        "Usage data: the pages you open, the browser and device you use, and errors the app records.",
        "Support messages: whatever you send us when you ask for help.",
      ],
    },
    {
      id: "use",
      title: "How we use it",
      paragraphs: ["Every use below is tied to running the product or to a choice you have made."],
      bullets: [
        "Render your generations and keep them in your library.",
        "Charge your balance and show the ledger it produces.",
        "Answer support requests and fix the faults they describe.",
        "Detect abuse, fraud and attempts to break the studio.",
        "Measure which models and pages are used, in aggregate, and only when analytics cookies are allowed.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        "Strictly necessary cookies keep you signed in, remember the cookie choice you made here and protect forms from cross-site requests. They are always on because the studio cannot work without them.",
        "Analytics cookies are optional. They tell us which models and pages get used, in aggregate, and are set only when you choose Accept all. Essential only leaves them off.",
        "Your choice is stored in this browser. Clearing site data makes the banner ask again, and you can email us to change the answer at any time.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing",
      paragraphs: [
        "We do not sell personal data. We share the minimum a processor needs to do its job for us, under contract.",
      ],
      bullets: [
        "Hosting and storage providers that serve the site and keep your media.",
        "Lemon Squeezy, which handles payments, tax and invoices.",
        "Email and support tools that deliver account mail and answer tickets.",
        "Analytics providers, only when you accept optional cookies.",
        "Authorities, when the law requires it or when someone's safety is at risk.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      paragraphs: ["We keep data only as long as the reason we collected it still stands."],
      bullets: [
        "Account and balance records: while your account is open, then as long as tax law requires.",
        "Generations and uploads: until you delete them or close your account.",
        "Support threads: 24 months after the last reply.",
        "Server logs: 30 days, then deleted or aggregated.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "You can ask for a copy of your data, correct it, export it, delete it, or object to analytics. You can also complain to your local data protection authority.",
        "Email privacy@chronolab.ai and we will answer within 30 days. We may ask you to confirm you own the account before we act.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "Data is encrypted in transit, and access is limited to the people who need it to run the service. No system is perfect, so keep your password to yourself and tell us if you think someone else has it.",
      ],
    },
    {
      id: "children",
      title: "Children",
      paragraphs: [
        "The studio is not for children under 16. We do not knowingly collect their data, and we delete it if we learn we have.",
      ],
    },
    {
      id: "changes",
      title: "Changes",
      paragraphs: [
        "We update this page when the product or the law changes. The date above always shows the version you are reading.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Chronolab.ai is the controller for the data described here. For privacy questions, email privacy@chronolab.ai. For anything else about your account, support@chronolab.ai is faster.",
      ],
    },
  ],
};

export const TERMS_DOCUMENT: LegalDocument = {
  eyebrow: "Legal",
  title: "Terms of service",
  description: "The agreement behind your account, the balance you spend and the frames you make.",
  updated: LEGAL_UPDATED.label,
  updatedIso: LEGAL_UPDATED.iso,
  contactEmail: "support@chronolab.ai",
  sections: [
    {
      id: "agreement",
      title: "The agreement",
      paragraphs: [
        "These terms cover chronolab.ai, the studio and your account. By using the service you accept them, so read them before you generate.",
        "If you use Chronolab.ai for a company, you confirm you can accept these terms for it.",
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      paragraphs: [
        "You need an account to generate. Keep your credentials safe and tell us straight away if you think someone else has them.",
        "You are responsible for what happens under your account, including the balance it spends. One person, one account: do not share a login to avoid seat pricing.",
      ],
    },
    {
      id: "billing",
      title: "Balance, prices and charges",
      paragraphs: [
        "Chronolab.ai is pay as you go. You buy a prepaid balance in US dollars, and each generation is charged from it at the price the studio shows before you generate.",
        "Your balance does not expire. There is no subscription, no seat count and no monthly minimum.",
        "Prices can change, but a change never affects a generation you have already been charged for.",
        "Payments, tax and invoices are handled by Lemon Squeezy. Where the law gives you a refund right on unused balance, email billing@chronolab.ai and we will process it.",
      ],
    },
    {
      id: "your-content",
      title: "Your content",
      paragraphs: [
        "You keep ownership of the prompts you write, the references you upload and the outputs you keep. You give us the limited licence we need to store them, process them and show them back to you.",
        "You confirm you have the rights to what you upload, and that you have permission from anyone who appears in it.",
      ],
    },
    {
      id: "output",
      title: "Generated output",
      paragraphs: [
        "Outputs are yours to use, including commercially, subject to these terms and to the law where you use them.",
        "Generative models can produce similar results for different people, so an output may not be unique. You are responsible for checking an output before you publish it.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: [
        "The studio is a tool for making images and motion. It is not a place for content that harms people.",
      ],
      bullets: [
        "No illegal, infringing, deceptive or harassing material.",
        "No likeness, voice or deepfake of a real person without their consent.",
        "Nothing that sexualises minors, promotes violence or incites hatred.",
        "No attempts to bypass safety systems, extract model weights or reverse engineer the service.",
        "No scraping, reselling or redistributing the service itself.",
        "No load that degrades the studio for everyone else.",
      ],
    },
    {
      id: "availability",
      title: "Availability and changes",
      paragraphs: [
        "The studio is provided as it is. We add, change and retire models, which changes how a prompt looks, and we occasionally take the service down for maintenance.",
        "We work to keep the studio available, but we cannot promise uninterrupted access or that a model will stay on the shelf forever.",
      ],
    },
    {
      id: "termination",
      title: "Suspension and closing",
      paragraphs: [
        "You can stop using the service at any time. We may suspend or close an account that breaks these terms or puts other people at risk, and we will tell you why.",
        "Unused balance on an account we close for a breach is handled as the law requires.",
      ],
    },
    {
      id: "liability",
      title: "Liability",
      paragraphs: [
        "To the extent the law allows, we are not liable for indirect or consequential loss, or for loss of profit, data or goodwill.",
        "Nothing here limits liability that cannot be limited by law, including for fraud or death and personal injury caused by negligence.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: [
        "We update these terms when the product or the law changes. The date above shows the current version, and continuing to use the studio after a change means you accept it.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Questions about these terms, your balance or a generation go to support@chronolab.ai. We answer on business days.",
      ],
    },
  ],
};

export const LEGAL_COPY = {
  contentsLabel: "On this page",
  updatedPrefix: "Updated",
  contactNote: "Questions about this page",
};

/** A heading is active once it reaches the reading line under the nav. */
export const ACTIVATION_OFFSET = 140;

/**
 * The shortest scroll distance an item gets. The final sections are often too
 * short to reach the reading line before the page ends, so the last item is
 * pinned to the bottom and the rail walks backwards from there. Without this,
 * one wheel step could skip several final sections.
 */
export const MIN_GAP = 90;

export const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
