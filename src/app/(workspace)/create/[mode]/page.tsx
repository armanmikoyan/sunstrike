import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Studio, StudioSkeleton } from "@/components/studio";
import type { GenerationMode } from "@/lib/generation";
import type { CreatePageProps } from "./types";

export async function generateMetadata({
  params,
}: CreatePageProps): Promise<Metadata> {
  const { mode } = await params;
  return {
    title: mode === "image" ? "Image Studio" : "Video Studio",
  };
}

export function generateStaticParams() {
  return [{ mode: "video" }, { mode: "image" }];
}

export default function Page({ params }: CreatePageProps) {
  return (
    <Suspense fallback={<StudioSkeleton />}>
      <CreateStudio params={params} />
    </Suspense>
  );
}

async function CreateStudio({ params }: CreatePageProps) {
  const { mode } = await params;
  if (mode !== "video" && mode !== "image") notFound();

  return <Studio initialMode={mode as GenerationMode} />;
}
