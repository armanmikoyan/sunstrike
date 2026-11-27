import { Link } from "@/components/link";
import { LogoLockup } from "@/components/brand";
import { FOOTER_COPY, FOOTER_GROUPS } from "./constants";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="border-t border-border px-5 py-10">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <LogoLockup compact className="w-68" />
            <p className="mt-3 max-w-70 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
              {FOOTER_COPY.description}
            </p>
            <div className="mt-4 text-xs lg:text-[0.6875rem] text-muted-foreground">{FOOTER_COPY.status}</div>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs lg:text-[0.6875rem] font-medium text-muted-foreground">{group.title}</p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-fit text-xs lg:text-[0.6875rem] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/6 pt-5 text-xs lg:text-[0.6875rem] text-muted-foreground sm:flex-row">
          <p>{FOOTER_COPY.copyright}</p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {FOOTER_COPY.terms}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {FOOTER_COPY.privacy}
            </Link>
            <span>{FOOTER_COPY.payg}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
