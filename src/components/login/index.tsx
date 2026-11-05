import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clapperboard, Globe, Maximize } from "lucide-react";
import { LogoLockup } from "@/components/brand";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { mediaById } from "@/lib/media";
import {
  loginCopy,
  loginHeroId,
  loginThumbnailIds,
} from "./constants";

const thumbnails = loginThumbnailIds
  .map((id) => mediaById(id))
  .filter((item) => item !== undefined);

export function Login() {
  const hero = mediaById(loginHeroId);

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[1.08fr_1fr]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-border lg:block">
        {hero ? (
          <VideoWithFallback
            src={hero.src}
            poster={hero.poster}
            fallback={hero.fallback}
            preload="auto"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1113] via-[#0f1113]/20 to-[#0f1113]/70" />

        <div className="relative flex min-h-screen flex-col justify-between p-8 xl:p-10">
          <LogoLockup />

          <div className="max-w-[31.25rem]">
            <p className="text-[0.75rem] text-white/70">
              {loginCopy.brand}
            </p>
            <h1 className="mt-4 text-[clamp(2.5rem,4.4vw,4rem)] font-medium leading-[0.98] tracking-[-0.06em] text-white">
              {loginCopy.heroTitleBefore}
              <br />
              <span className="font-display font-normal">
                {loginCopy.heroTitleAccent}
              </span>
            </h1>
            <p className="mt-4 max-w-[22.5rem] text-[0.75rem] leading-relaxed text-white/55">
              {loginCopy.heroDescription}
            </p>

            <div className="mt-7 flex items-end gap-2">
              {thumbnails.map((item, index) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg border border-white/15 bg-secondary"
                  style={{
                    width: index === 1 ? "6.5rem" : "5.125rem",
                    height: index === 1 ? "8rem" : "6.5rem",
                  }}
                >
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-1.5 text-[0.6875rem] text-white/70">
                    {item.title}
                  </span>
                </div>
              ))}
              <div className="ml-1 flex flex-col gap-2 pb-1">
                <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/70">
                  <Clapperboard className="size-3 text-white/70" />
                  {loginCopy.motion}
                </span>
                <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/70">
                  <Maximize className="size-3 text-white/70" />
                  {loginCopy.upscale}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[0.6875rem] text-white/60">
            {loginCopy.copyright}
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <LogoLockup compact />
          <Link href="/" className="text-[0.6875rem] text-muted-foreground">
            {loginCopy.backToStudio}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-[21.25rem]">
            <p className="text-[0.75rem] text-muted-foreground">
              {loginCopy.eyebrow}
            </p>
            <h2 className="mt-3 text-[1.75rem] font-medium tracking-[-0.05em]">
              {loginCopy.title}
            </h2>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
              {loginCopy.description}
            </p>

            <div className="mt-6 space-y-3">
              <div>
                <label className="text-[0.6875rem] font-medium text-foreground/80">
                  {loginCopy.emailLabel}
                </label>
                <Input
                  type="email"
                  placeholder={loginCopy.emailPlaceholder}
                  className="mt-1.5 h-10 rounded-lg border-white/[0.09] bg-white/[0.025] text-[0.75rem] placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[0.6875rem] font-medium text-foreground/80">
                    {loginCopy.passwordLabel}
                  </label>
                  <Link
                    href="/help"
                    className="text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {loginCopy.forgot}
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder={loginCopy.passwordPlaceholder}
                  className="mt-1.5 h-10 rounded-lg border-white/[0.09] bg-white/[0.025] text-[0.75rem] placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
                />
              </div>
              <Button
                asChild
                className="h-10 w-full rounded-lg bg-brand text-[0.6875rem] font-semibold text-brand-foreground hover:bg-brand-hover"
              >
                <Link href="/">
                  {loginCopy.signIn}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[0.6875rem] text-muted-foreground">
                {loginCopy.or}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-lg border-white/[0.09] bg-white/[0.02] text-[0.6875rem] text-foreground hover:bg-white/[0.05]"
            >
              <Link href="/">
                <Globe className="size-3.5" />
                {loginCopy.google}
              </Link>
            </Button>

            <p className="mt-6 text-center text-[0.6875rem] text-muted-foreground">
              {loginCopy.newTo}{" "}
              <Link
                href="/"
                className="font-medium text-foreground transition-opacity hover:opacity-80"
              >
                {loginCopy.createStudio}
              </Link>
            </p>

            <p className="mt-8 text-center text-[0.6875rem] leading-relaxed text-muted-foreground">
              {loginCopy.termsBefore}
              <Link href="/help" className="underline underline-offset-2">
                {loginCopy.terms}
              </Link>
              {loginCopy.termsAnd}
              <Link href="/help" className="underline underline-offset-2">
                {loginCopy.privacy}
              </Link>
              {loginCopy.termsAfter}
            </p>
          </div>
        </div>

        <div className="p-5 text-center text-[0.6875rem] text-muted-foreground lg:hidden">
          {loginCopy.footer}
        </div>
      </section>
    </main>
  );
}
