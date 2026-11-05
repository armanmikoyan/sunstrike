import Link from "next/link";
import { LogoLockup } from "@/components/brand";
import { cn } from "@/lib/utils";
import { footerCopy, footerGroups } from "./constants";

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
            <p className="mt-3 max-w-[17.5rem] text-[0.75rem] leading-relaxed text-muted-foreground">
              {footerCopy.description}
            </p>
            <div className="mt-4 text-[0.6875rem] text-muted-foreground">
              {footerCopy.status}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-[0.6875rem] font-medium text-muted-foreground">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-fit text-[0.75rem] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-5 text-[0.6875rem] text-muted-foreground sm:flex-row">
          <p>{footerCopy.copyright}</p>
          <div className="flex items-center gap-5">
            <Link href="/help" className="transition-colors hover:text-foreground">
              {footerCopy.terms}
            </Link>
            <Link href="/help" className="transition-colors hover:text-foreground">
              {footerCopy.privacy}
            </Link>
            <span>{footerCopy.payg}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
