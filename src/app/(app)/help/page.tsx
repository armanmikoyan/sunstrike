import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Mail,
  MessageCircle,
  Layers3,
  Video,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Help",
};

const guides = [
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

const questions = [
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

export default function HelpPage() {
  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow="Support"
          title="Help center"
          description="Short answers, working examples and a real person when you need one."
          action={
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-lg border-white/[0.09] bg-white/[0.02] px-3 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
            >
              <Link href="mailto:support@chronolab.ai">
                <Mail className="size-3.5" />
                Contact support
              </Link>
            </Button>
          }
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.title}
                href={guide.href}
                className="group rounded-xl border border-white/[0.07] bg-white/[0.012] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-muted-foreground">
                    <Icon className="size-3.5" strokeWidth={1.8} />
                  </span>
                  <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-5 text-[0.6875rem] font-medium">{guide.title}</p>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18.75rem]">
          <div>
            <h2 className="text-[1.125rem] font-medium tracking-[-0.035em]">
              Common questions
            </h2>
            <div className="mt-3">
              {questions.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-white/[0.07] py-3.5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[0.6875rem] font-medium">
                    {item.question}
                    <span className="relative size-3">
                      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-muted-foreground" />
                      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-muted-foreground transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-2 max-w-[35rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-xl border border-white/[0.08] bg-[#18191c] p-5">
            <span className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
              <MessageCircle className="size-4" />
            </span>
            <h3 className="mt-4 text-[0.8125rem] font-medium">Still stuck?</h3>
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              Send us a prompt, a render ID or a screen recording. A real
              person from the studio replies within one working day.
            </p>
            <Button
              asChild
              className="mt-4 h-9 w-full rounded-lg bg-brand text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
            >
              <Link href="mailto:support@chronolab.ai">
                <Mail className="size-3" />
                support@chronolab.ai
              </Link>
            </Button>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[0.6875rem] text-muted-foreground">
              <span>Mon–Fri · 09:00–18:00 CET</span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
