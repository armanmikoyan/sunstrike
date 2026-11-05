import {
  BookOpen,
  CreditCard,
  Layers3,
  Video,
} from "lucide-react";

export const supportEmail = "support@chronolab.ai";

export const helpGuides = [
  {
    title: "Your first shot",
    description: "Prompting, references, camera moves and takes.",
    icon: Video,
    href: "/create/video",
  },
  {
    title: "Billing & renders",
    description: "How costs are calculated and when they are charged.",
    icon: CreditCard,
    href: "/pricing",
  },
  {
    title: "Models & resolution",
    description: "Pick the right model for stills, motion and products.",
    icon: Layers3,
    href: "/explore",
  },
  {
    title: "API",
    description: "Bring Chronolab into your own pipeline.",
    icon: BookOpen,
    href: "/settings",
  },
];

export const helpQuestions = [
  {
    question: "How does billing work?",
    answer:
      "You pay in US dollars from one balance used across every image and video model. The price is shown in the composer before you generate.",
  },
  {
    question: "Can I keep an unused balance?",
    answer:
      "Yes. Your balance never expires and there is no subscription. Auto top-up is optional.",
  },
  {
    question: "What sizes can I generate?",
    answer:
      "Images render up to 4 megapixels. Video renders in 16:9, 9:16, 1:1, 4:3, 3:4 and 21:9 at up to 4K upscaling.",
  },
  {
    question: "How do I share a project?",
    answer:
      "Open any take in the studio and use Share. You can send a view-only link or invite a collaborator from your workspace.",
  },
  {
    question: "Do you train on my work?",
    answer:
      "No. Your prompts and outputs are private by default and are never used to train models without explicit opt-in.",
  },
];

export const helpCopy = {
  eyebrow: "Support",
  title: "Help center",
  description:
    "Short answers, working examples and a real person when you need one.",
  contactSupport: "Contact support",
  commonQuestions: "Common questions",
  stuckTitle: "Still stuck?",
  stuckDescription:
    "Send us a prompt, a render ID or a screen recording. A real person from the studio replies within one working day.",
  hours: "Mon–Fri · 09:00–18:00 CET",
  status: "Online",
};
