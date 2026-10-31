import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ExploreGallery } from "@/components/gallery/explore-gallery";
import { PageHeader } from "@/components/shared/page-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Explore",
};

export default function ExplorePage() {
  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow="Community"
          title="The feed"
          description="Fresh work from the Sunstrike community. Inspect the prompt, model and render price, then remix it into your own studio."
          action={
            <Button
              asChild
              className="h-10 rounded-lg bg-brand px-4 text-[12px] font-medium text-brand-foreground hover:bg-brand-hover"
            >
              <Link href="/create/video">
                Publish a frame
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          }
        />
        <ExploreGallery />
      </div>
      <SiteFooter />
    </>
  );
}
