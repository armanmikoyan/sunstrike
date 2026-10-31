import Link from "next/link";
import { LogoLockup } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const groups = [
  {
    title: "Create",
    links: [
      { label: "Video studio", href: "/create/video" },
      { label: "Image studio", href: "/create/image" },
      { label: "Explore", href: "/explore" },
      { label: "Library", href: "/library" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Billing", href: "/billing" },
      { label: "Settings", href: "/settings" },
      { label: "Help", href: "/help" },
    ],
  },
];

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      id="site-footer"
      className={cn("border-t border-border px-5 py-10", className)}
    >
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <LogoLockup compact />
            <p className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-muted-foreground">
              Stills and motion in one studio. No subscription, no seat count,
              no expiring balance.
            </p>
            <div className="mt-4 text-[11px] text-muted-foreground">
              All systems rendering
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-fit text-[12px] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-5 text-[11px] text-muted-foreground sm:flex-row">
          <p>© 2026 Sunstrike.ai. All frames reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/help" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/help" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <span>Pay as you go</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
