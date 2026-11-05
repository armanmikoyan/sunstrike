import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ExploreGallery } from "@/components/explore-gallery";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { exploreCopy } from "./constants";

export function Explore() {
  return (
    <>
      <div className="w-full px-5 py-7">
        <PageHeader
          eyebrow={exploreCopy.eyebrow}
          title={exploreCopy.title}
          description={exploreCopy.description}
          action={
            <Button
              asChild
              className="h-10 rounded-lg bg-brand px-4 text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
            >
              <Link href="/create/video">
                {exploreCopy.action}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          }
        />
        <ExploreGallery />
      </div>
    </>
  );
}
