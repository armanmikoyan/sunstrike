import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ExploreGallery } from "@/components/explore-gallery";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { Button } from "@/ui/button";
import { EXPLORE_COPY } from "./constants";

export function Explore() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={EXPLORE_COPY.eyebrow}
        title={EXPLORE_COPY.title}
        description={EXPLORE_COPY.description}
        divider={false}
        action={
          <Button asChild size="cta">
            <Link href="/create/video">
              {EXPLORE_COPY.action}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        }
      />
      <ExploreGallery />
    </PageShell>
  );
}
