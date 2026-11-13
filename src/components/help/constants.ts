import { CreditCard, Layers3, Video } from "lucide-react";

export const supportEmail = "support@chronolab.ai";

export const helpGuides = [
  {
    title: "Your first shot",
    description: "Prompting, references, templates and settings.",
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
      "Yes. Your balance never expires and there is no subscription.",
  },
  {
    question: "What sizes can I generate?",
    answer:
      "Video renders in up to six aspect ratios at 720p or 1080p. Images render up to 4 megapixels. The exact options depend on the model you pick.",
  },
  {
    question: "How do I edit a frame?",
    answer:
      "Open the studio, add the frame as a reference and pick a template. The model keeps the source and writes a new output.",
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
