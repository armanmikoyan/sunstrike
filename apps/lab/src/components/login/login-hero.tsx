import Image from "next/image";
import { Clapperboard, Maximize } from "lucide-react";
import { LogoLockup } from "@/components/brand";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { mediaById } from "@/mocks/media";
import { loginCopy, loginHeroId, loginThumbnails } from "./constants";

export function LoginHero() {
  const hero = mediaById(loginHeroId);

  return (
    <section className="relative hidden min-h-screen overflow-hidden lg:block">
      {hero ? (
        <VideoWithFallback
          src={hero.src}
          poster={hero.poster}
          fallback={hero.fallback}
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-t from-[#08090b] via-[#08090b]/20 to-[#08090b]/70" />

      <div className="relative flex min-h-screen flex-col justify-between p-8 xl:p-10">
        <LogoLockup className="w-72" />

        <div className="max-w-125">
          <p className="text-xs text-white/70 lg:text-[0.6875rem]">{loginCopy.brand}</p>
          <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.06em] text-white">
            {loginCopy.heroTitleBefore}
            <br />
            <span className="font-display font-normal">{loginCopy.heroTitleAccent}</span>
          </h1>
          <p className="mt-4 max-w-90 text-sm leading-relaxed text-white/55 lg:text-xs">{loginCopy.heroDescription}</p>

          <div className="mt-7 flex items-end gap-2">
            {loginThumbnails.map((item, index) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg border border-white/15 bg-secondary"
                style={{
                  width: index === 1 ? "6.5rem" : "5.125rem",
                  height: index === 1 ? "8rem" : "6.5rem",
                }}
              >
                <Image src={item.poster} alt={item.title} fill sizes="120px" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 text-xs text-white/70 lg:text-[0.6875rem]">
                  {item.title}
                </span>
              </div>
            ))}
            <div className="ml-1 flex flex-col gap-2 pb-1">
              <span className="flex items-center gap-1.5 text-xs text-white/70 lg:text-[0.6875rem]">
                <Clapperboard className="size-3 text-white/70" />
                {loginCopy.motion}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/70 lg:text-[0.6875rem]">
                <Maximize className="size-3 text-white/70" />
                {loginCopy.upscale}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/60 lg:text-[0.6875rem]">{loginCopy.copyright}</p>
      </div>
    </section>
  );
}
