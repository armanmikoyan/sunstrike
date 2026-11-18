import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/ui/button";
import { FEATURED, HOME_COPY } from "./constants";

export function HomeGallery() {
  return (
    <section className="border-t border-border/70">
      <div className="w-full px-5 py-16">
        <SectionHeader
          title={
            <>
              {HOME_COPY.gallery.titleBefore}
              <span className="font-serif italic text-brand">{HOME_COPY.gallery.titleAccent}</span>
            </>
          }
          description={HOME_COPY.gallery.description}
          action={
            <Button
              asChild
              variant="ghost"
              className="hidden h-8 rounded-lg px-2.5 text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/4 hover:text-foreground sm:flex"
            >
              <Link href="/explore">
                {HOME_COPY.gallery.action}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          }
          className="mb-6"
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FEATURED.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
